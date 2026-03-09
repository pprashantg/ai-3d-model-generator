import express from "express";
import * as modelController from "../controllers/modelController.js";

const router = express.Router();

/**
 * Middleware to validate model generation request body
 */
const validateGenerateRequest = (req, res, next) => {
  const {
    modelType,
    material,
    complexity,
    dimensions,
    modelName,
    description,
  } = req.body;

  // Check required fields
  const requiredFields = ["modelType", "material", "complexity", "dimensions"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Validate dimensions object
  if (
    typeof dimensions !== "object" ||
    !dimensions.width ||
    !dimensions.height ||
    !dimensions.depth
  ) {
    return res.status(400).json({
      success: false,
      error: "dimensions must include width, height, and depth",
      timestamp: new Date().toISOString(),
    });
  }

  // Validate model type
  const validTypes = ["gear", "bearing", "bracket", "shaft"];
  if (!validTypes.includes(modelType)) {
    return res.status(400).json({
      success: false,
      error: `Invalid modelType. Must be one of: ${validTypes.join(", ")}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Validate material
  const validMaterials = [
    "steel",
    "aluminum",
    "titanium",
    "plastic",
    "composite",
  ];
  if (!validMaterials.includes(material)) {
    return res.status(400).json({
      success: false,
      error: `Invalid material. Must be one of: ${validMaterials.join(", ")}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Validate complexity
  const validComplexities = ["simple", "medium", "complex", "advanced"];
  if (!validComplexities.includes(complexity)) {
    return res.status(400).json({
      success: false,
      error: `Invalid complexity. Must be one of: ${validComplexities.join(", ")}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Validate dimension values
  if (
    typeof dimensions.width !== "number" ||
    dimensions.width <= 0 ||
    dimensions.width > 10000
  ) {
    return res.status(400).json({
      success: false,
      error: "dimensions.width must be a number between 1 and 10000",
      timestamp: new Date().toISOString(),
    });
  }

  if (
    typeof dimensions.height !== "number" ||
    dimensions.height <= 0 ||
    dimensions.height > 10000
  ) {
    return res.status(400).json({
      success: false,
      error: "dimensions.height must be a number between 1 and 10000",
      timestamp: new Date().toISOString(),
    });
  }

  if (
    typeof dimensions.depth !== "number" ||
    dimensions.depth <= 0 ||
    dimensions.depth > 10000
  ) {
    return res.status(400).json({
      success: false,
      error: "dimensions.depth must be a number between 1 and 10000",
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

/**
 * API Routes
 */

/**
 * POST /generate-from-text
 * Generate a model from natural language text (AI-powered)
 *
 * Request body:
 * {
 *   text: "Generate a titanium gear with 24 teeth and radius 10 cm"
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   model: { id, geometry, ... },
 *   parsedParams: { modelType, material, ... },
 *   metadata: { generationTime, timestamp, originalText }
 * }
 */
router.post("/generate-from-text", modelController.generateFromText);

/**
 * POST /generate
 * Generate a new 3D engineering model
 *
 * Request body:
 * {
 *   modelName: string,
 *   modelType: "gear" | "bearing" | "bracket" | "shaft",
 *   complexity: "simple" | "medium" | "complex" | "advanced",
 *   dimensions: { width, height, depth },
 *   material: "steel" | "aluminum" | "titanium" | "plastic" | "composite",
 *   description?: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   model: { id, geometry, ... },
 *   metadata: { generationTime, timestamp }
 * }
 */
router.post(
  "/generate",
  validateGenerateRequest,
  modelController.generateModel,
);

/**
 * GET /export/:id
 * Export a generated model in specified format
 *
 * Query Parameters:
 * - format: "glb" | "gltf" | "obj" (default: "glb")
 *
 * Response: Binary file (application/octet-stream)
 */
router.get("/export/:id", modelController.exportModel);

/**
 * GET /:id
 * Retrieve a specific model by ID
 *
 * Response:
 * {
 *   success: boolean,
 *   model: { ... }
 * }
 */
router.get("/:id", modelController.getModel);

/**
 * GET /
 * List all generated models
 *
 * Response:
 * {
 *   success: boolean,
 *   count: number,
 *   models: [ ... ]
 * }
 */
router.get("/", modelController.listModels);

export default router;
