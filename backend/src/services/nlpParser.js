/**
 * Natural Language Parser Service
 * Extracts engineering model parameters from natural language text
 *
 * Example inputs:
 * - "Generate a titanium gear with 24 teeth and radius 10 cm"
 * - "Create a steel bracket 100mm x 50mm x 30mm"
 * - "Make an aluminum bearing with 5cm diameter"
 */

/**
 * Parse natural language text and extract model parameters
 * @param {string} text - Natural language input
 * @returns {Object} Structured model parameters
 */
export function parseNaturalLanguage(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input text");
  }

  const lowerText = text.toLowerCase();

  // Extract model type
  const modelType = extractModelType(lowerText);

  // Extract material
  const material = extractMaterial(lowerText);

  // Extract dimensions
  const dimensions = extractDimensions(lowerText, modelType);

  // Extract complexity (or infer from detail level)
  const complexity = extractComplexity(lowerText);

  // Extract specific parameters (e.g., teeth count for gears)
  const specificParams = extractSpecificParameters(lowerText, modelType);

  // Build model name from parsed data
  const modelName = generateModelName(modelType, material, specificParams);

  return {
    modelName,
    modelType,
    material,
    complexity,
    dimensions,
    description: text,
    ...specificParams,
  };
}

/**
 * Extract model type from text
 */
function extractModelType(text) {
  const typePatterns = [
    { type: "gear", patterns: ["gear", "cog", "cogwheel", "sprocket"] },
    {
      type: "bearing",
      patterns: ["bearing", "ball bearing", "roller bearing"],
    },
    { type: "bracket", patterns: ["bracket", "mount", "support", "holder"] },
    { type: "shaft", patterns: ["shaft", "axle", "rod", "spindle"] },
  ];

  for (const { type, patterns } of typePatterns) {
    if (patterns.some((pattern) => text.includes(pattern))) {
      return type;
    }
  }

  // Default to gear if not specified
  return "gear";
}

/**
 * Extract material from text
 */
function extractMaterial(text) {
  const materials = ["titanium", "steel", "aluminum", "plastic", "composite"];

  for (const material of materials) {
    if (text.includes(material) || text.includes(material.slice(0, -2))) {
      return material;
    }
  }

  // Default to steel
  return "steel";
}

/**
 * Extract dimensions from text
 * Handles various formats: "10cm", "100mm", "5 inches", "10x5x3", etc.
 */
function extractDimensions(text, modelType) {
  // Try to extract dimension pattern like "100mm x 50mm x 30mm" or "10x5x3"
  const dimensionPattern =
    /(\d+(?:\.\d+)?)\s*(?:mm|cm|m|inch|in)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:mm|cm|m|inch|in)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:mm|cm|m|inch|in)?/i;
  const match = text.match(dimensionPattern);

  if (match) {
    const [, width, height, depth] = match;
    return {
      width: parseFloat(width),
      height: parseFloat(height),
      depth: parseFloat(depth),
    };
  }

  // Try to extract single dimension (for cylindrical objects like bearings/shafts)
  const singleDimPatterns = [
    /(?:radius|diameter|width|size|length)?\s*(?:of)?\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|inch|in)?/i,
    /(\d+(?:\.\d+)?)\s*(mm|cm|m|inch|in)?/,
  ];

  let dimension = 100; // Default

  for (const pattern of singleDimPatterns) {
    const singleMatch = text.match(pattern);
    if (singleMatch) {
      dimension = parseFloat(singleMatch[1]);
      const unit = singleMatch[2]?.toLowerCase();

      // Convert to mm
      if (unit === "cm") dimension *= 10;
      else if (unit === "m") dimension *= 1000;
      else if (unit === "inch" || unit === "in") dimension *= 25.4;

      break;
    }
  }

  // Return appropriate dimensions based on model type
  switch (modelType) {
    case "shaft":
      return {
        width: dimension * 2,
        height: dimension / 4,
        depth: dimension / 4,
      };
    case "bearing":
      return {
        width: dimension * 2,
        height: dimension / 2,
        depth: dimension / 2,
      };
    case "gear":
      return { width: dimension, height: dimension / 4, depth: dimension / 4 };
    case "bracket":
    default:
      return {
        width: dimension,
        height: dimension * 0.7,
        depth: dimension * 0.5,
      };
  }
}

/**
 * Extract complexity level from text
 */
function extractComplexity(text) {
  const complexityKeywords = {
    simple: ["simple", "basic", "easy", "minimal"],
    medium: ["medium", "standard", "normal", "regular"],
    complex: ["complex", "detailed", "advanced", "intricate"],
    advanced: ["advanced", "high detail", "very detailed", "maximum"],
  };

  for (const [level, keywords] of Object.entries(complexityKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return level;
    }
  }

  // Check for number indicators (e.g., "24 teeth" suggests complex)
  if (/\d{2,}/.test(text)) {
    return "complex";
  }

  return "medium";
}

/**
 * Extract model-specific parameters
 */
function extractSpecificParameters(text, modelType) {
  const params = {};

  // For gears - extract teeth count
  if (modelType === "gear") {
    const teethMatch = text.match(/(\d+)\s*teeth/i);
    if (teethMatch) {
      params.teethCount = parseInt(teethMatch[1]);
    }
  }

  // Extract hole/mounting specifications
  const holesMatch = text.match(/(\d+)\s*(?:hole|mount|mounting)/i);
  if (holesMatch) {
    params.holeCount = parseInt(holesMatch[1]);
  }

  return params;
}

/**
 * Generate a descriptive model name
 */
function generateModelName(modelType, material, specificParams) {
  let name = `${material.charAt(0).toUpperCase() + material.slice(1)} ${modelType.charAt(0).toUpperCase() + modelType.slice(1)}`;

  if (specificParams.teethCount) {
    name += ` (${specificParams.teethCount}T)`;
  }

  return name;
}

/**
 * Example usage and test cases
 */
export const exampleInputs = [
  "Generate a titanium gear with 24 teeth and radius 10 cm",
  "Create a steel bracket 100mm x 50mm x 30mm",
  "Make an aluminum bearing with 5cm diameter",
  "Build a complex plastic shaft 200mm long",
  "Simple steel gear with 12 teeth",
  "Advanced composite bracket with 4 mounting holes",
];

/**
 * Validate parsed parameters
 */
export function validateParsedParams(params) {
  const errors = [];

  const validTypes = ["gear", "bearing", "bracket", "shaft"];
  if (!validTypes.includes(params.modelType)) {
    errors.push(`Invalid modelType: ${params.modelType}`);
  }

  const validMaterials = [
    "steel",
    "aluminum",
    "titanium",
    "plastic",
    "composite",
  ];
  if (!validMaterials.includes(params.material)) {
    errors.push(`Invalid material: ${params.material}`);
  }

  if (!params.dimensions || typeof params.dimensions !== "object") {
    errors.push("Invalid dimensions");
  } else {
    if (params.dimensions.width <= 0 || params.dimensions.width > 10000) {
      errors.push("Width must be between 1 and 10000");
    }
    if (params.dimensions.height <= 0 || params.dimensions.height > 10000) {
      errors.push("Height must be between 1 and 10000");
    }
    if (params.dimensions.depth <= 0 || params.dimensions.depth > 10000) {
      errors.push("Depth must be between 1 and 10000");
    }
  }

  return errors.length > 0 ? errors : null;
}
