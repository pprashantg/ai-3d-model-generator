import * as modelService from "../services/modelService.js";
import {
  parseNaturalLanguage,
  validateParsedParams,
} from "../services/nlpParser.js";

/**
 * Generate a 3D engineering model from natural language text
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function generateFromText(req, res, next) {
  const startTime = Date.now();

  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        error: "Text input is required",
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`[NLP Generation] Input: "${text}"`);

    // Parse natural language to structured parameters
    const parsedParams = parseNaturalLanguage(text);
    console.log("[NLP Generation] Parsed parameters:", parsedParams);

    // Validate parsed parameters
    const validationErrors = validateParsedParams(parsedParams);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        error: "Invalid parameters extracted from text",
        details: validationErrors,
        parsedParams,
        timestamp: new Date().toISOString(),
      });
    }

    // Generate the model using parsed parameters
    const model = await modelService.generateModel(parsedParams);

    const generationTime = Date.now() - startTime;

    console.log(
      `[NLP Generation] Success: ${parsedParams.modelType}, Time: ${generationTime}ms`,
    );

    res.status(201).json({
      success: true,
      model: model,
      parsedParams: parsedParams,
      metadata: {
        generationTime: `${generationTime}ms`,
        timestamp: new Date().toISOString(),
        originalText: text,
      },
    });
  } catch (error) {
    const generationTime = Date.now() - startTime;
    console.error(
      `[NLP Generation Error] Time: ${generationTime}ms, Error:`,
      error.message,
    );
    next(error);
  }
}

/**
 * Generate a 3D engineering model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export async function generateModel(req, res, next) {
  const startTime = Date.now();

  try {
    // Validate input parameters
    const validationError = validateModelInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
        timestamp: new Date().toISOString(),
      });
    }

    // Generate the model
    const model = await modelService.generateModel(req.body);

    // Calculate generation time
    const generationTime = Date.now() - startTime;

    // Log performance metrics
    console.log(
      `[Model Generation] Type: ${req.body.modelType}, Complexity: ${req.body.complexity}, Time: ${generationTime}ms`,
    );

    // Return success response
    res.status(201).json({
      success: true,
      model: model,
      metadata: {
        generationTime: `${generationTime}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const generationTime = Date.now() - startTime;
    console.error(
      `[Model Generation Error] Time: ${generationTime}ms, Error:`,
      error.message,
    );
    next(error);
  }
}

/**
 * Validate model generation input parameters
 * @param {Object} data - Request body data
 * @returns {string|null} Error message or null if valid
 */
function validateModelInput(data) {
  const { modelType, material, complexity, dimensions } = data;

  // Valid options
  const validModelTypes = ["gear", "bearing", "bracket", "shaft"];
  const validMaterials = [
    "steel",
    "aluminum",
    "titanium",
    "plastic",
    "composite",
  ];
  const validComplexities = ["simple", "medium", "complex", "advanced"];

  // Validate modelType
  if (!modelType) {
    return "modelType is required";
  }
  if (!validModelTypes.includes(modelType)) {
    return `Invalid modelType. Must be one of: ${validModelTypes.join(", ")}`;
  }

  // Validate material
  if (!material) {
    return "material is required";
  }
  if (!validMaterials.includes(material)) {
    return `Invalid material. Must be one of: ${validMaterials.join(", ")}`;
  }

  // Validate complexity
  if (!complexity) {
    return "complexity is required";
  }
  if (!validComplexities.includes(complexity)) {
    return `Invalid complexity. Must be one of: ${validComplexities.join(", ")}`;
  }

  // Validate dimensions
  if (!dimensions || typeof dimensions !== "object") {
    return "dimensions object is required";
  }

  const { width, height, depth } = dimensions;

  if (typeof width !== "number" || width <= 0 || width > 10000) {
    return "dimensions.width must be a positive number between 1 and 10000";
  }

  if (typeof height !== "number" || height <= 0 || height > 10000) {
    return "dimensions.height must be a positive number between 1 and 10000";
  }

  if (typeof depth !== "number" || depth <= 0 || depth > 10000) {
    return "dimensions.depth must be a positive number between 1 and 10000";
  }

  return null; // All validations passed
}

export async function getModel(req, res, next) {
  try {
    const model = await modelService.getModel(req.params.id);
    if (!model) {
      console.log(`[Model Retrieval] Model not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: "Model not found",
        timestamp: new Date().toISOString(),
      });
    }

    console.log(
      `[Model Retrieval] Successfully retrieved model: ${req.params.id}`,
    );
    res.json({
      success: true,
      model: model,
    });
  } catch (error) {
    console.error(
      `[Model Retrieval Error] ID: ${req.params.id}, Error:`,
      error.message,
    );
    next(error);
  }
}

export async function listModels(req, res, next) {
  try {
    const models = await modelService.listModels();
    console.log(`[Model List] Retrieved ${models.length} models`);

    res.json({
      success: true,
      count: models.length,
      models: models,
    });
  } catch (error) {
    console.error("[Model List Error]", error.message);
    next(error);
  }
}

export async function exportModel(req, res, next) {
  const startTime = Date.now();

  try {
    const { id } = req.params; // Get id from URL path
    const { format = "glb" } = req.query; // Get format from query params

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Model ID is required",
        timestamp: new Date().toISOString(),
      });
    }

    const validFormats = ["glb", "gltf", "obj"];
    if (!validFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        error: `Invalid format. Must be one of: ${validFormats.join(", ")}`,
        timestamp: new Date().toISOString(),
      });
    }

    const modelBuffer = await modelService.exportModel(id, format);
    const exportTime = Date.now() - startTime;

    console.log(
      `[Model Export] ID: ${id}, Format: ${format}, Time: ${exportTime}ms`,
    );

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="model.${format}"`,
    );
    res.send(modelBuffer);
  } catch (error) {
    const exportTime = Date.now() - startTime;
    console.error(
      `[Model Export Error] Time: ${exportTime}ms, Error:`,
      error.message,
    );
    next(error);
  }
}
