import axios from "axios";

/**
 * API Service for 3D Model Generation
 * Base URL: http://localhost:5001/api/models
 */

// Configure Axios instance with default settings
const API_BASE_URL = "http://localhost:5001/api/models";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error.message);
    if (error.response) {
      // Server responded with error
      console.error(
        "[API Response Error]",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response
      console.error("[API Request Error] No response received");
    } else {
      // Error in request setup
      console.error("[API Setup Error]", error.message);
    }
    return Promise.reject(error);
  },
);

/**
 * Model API Service
 * Methods for generating, retrieving, and exporting 3D models
 */
export const modelService = {
  /**
   * Generate a new 3D model
   * @param {Object} formData - Model configuration
   * @param {string} formData.modelName - Model name
   * @param {string} formData.modelType - Type of model
   * @param {string} formData.complexity - Complexity level
   * @param {Object} formData.dimensions - Model dimensions
   * @param {string} formData.material - Material type
   * @param {string} [formData.description] - Optional description
   * @returns {Promise<Object>} Generated model object with geometry
   * @throws {Error} API error with descriptive message
   */
  generateModel: async (formData) => {
    try {
      console.log("[ModelService] Generating model...", formData.modelType);
      const response = await apiClient.post("/generate", formData);

      // Handle success response
      if (response.data.success) {
        console.log("[ModelService] Model generated successfully");
        return response.data.model; // Return only model object
      } else {
        throw new Error(response.data.error || "Failed to generate model");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to generate model";
      console.error("[ModelService] Generation error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Generate model from natural language text (AI-powered)
   * @param {string} text - Natural language description
   * @returns {Promise<Object>} Generated model with parsed parameters
   * @throws {Error} API error with descriptive message
   */
  generateFromText: async (text) => {
    try {
      console.log("[ModelService] Generating from text:", text);
      const response = await apiClient.post("/generate-from-text", { text });

      if (response.data.success) {
        console.log("[ModelService] Text-based generation successful");
        console.log(
          "[ModelService] Parsed params:",
          response.data.parsedParams,
        );
        return {
          model: response.data.model,
          parsedParams: response.data.parsedParams,
          metadata: response.data.metadata,
        };
      } else {
        throw new Error(response.data.error || "Failed to generate from text");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to generate model from text";
      console.error("[ModelService] Text generation error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Retrieve all generated models
   * @returns {Promise<Array>} Array of model objects
   * @throws {Error} API error with descriptive message
   */
  listModels: async () => {
    try {
      console.log("[ModelService] Fetching models list...");
      const response = await apiClient.get("/");

      if (response.data.success) {
        console.log(
          `[ModelService] Retrieved ${response.data.models.length} models`,
        );
        return response.data.models; // Return only models array
      } else {
        throw new Error(response.data.error || "Failed to fetch models");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch models";
      console.error("[ModelService] List error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Retrieve a specific model by ID
   * @param {string} id - Model ID
   * @returns {Promise<Object>} Model object with geometry data
   * @throws {Error} API error with descriptive message
   */
  getModel: async (id) => {
    try {
      if (!id) {
        throw new Error("Model ID is required");
      }

      console.log("[ModelService] Fetching model:", id);
      const response = await apiClient.get(`/${id}`);

      if (response.data.success) {
        console.log("[ModelService] Model retrieved successfully");
        return response.data.model; // Return only model object
      } else {
        throw new Error(response.data.error || "Failed to fetch model");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to fetch model";
      console.error("[ModelService] Get error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Export a model in specified format
   * @param {string} id - Model ID
   * @param {string} [format="glb"] - Export format ("glb", "gltf", "obj")
   * @returns {Promise<Blob>} Binary file blob
   * @throws {Error} API error with descriptive message
   */
  exportModel: async (id, format = "glb") => {
    try {
      if (!id) {
        throw new Error("Model ID is required");
      }

      const validFormats = ["glb", "gltf", "obj"];
      if (!validFormats.includes(format)) {
        throw new Error(
          `Invalid format. Must be one of: ${validFormats.join(", ")}`,
        );
      }

      console.log("[ModelService] Exporting model as", format);
      const response = await apiClient.get("/export/" + id, {
        params: { format },
        responseType: "blob",
      });

      console.log("[ModelService] Model exported successfully");
      return response.data; // Return blob directly for download
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        `Failed to export model as ${format}`;
      console.error("[ModelService] Export error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Check API health
   * @returns {Promise<Object>} Server health status
   * @throws {Error} API error
   */
  checkHealth: async () => {
    try {
      console.log("[ModelService] Checking API health...");
      const response = await axios.get("http://localhost:5001/api/health");
      console.log("[ModelService] API is healthy");
      return response.data;
    } catch (error) {
      console.error("[ModelService] Health check failed:", error.message);
      throw new Error("API server is not responding");
    }
  },
};
