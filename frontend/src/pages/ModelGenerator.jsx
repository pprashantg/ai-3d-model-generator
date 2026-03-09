import { useState } from "react";
import ModelForm from "../components/ModelForm";
import ModelViewer from "../components/ModelViewer";
import NaturalLanguageInput from "../components/NaturalLanguageInput";
import { modelService } from "../services/modelService";
import "./ModelGenerator.css";

/**
 * ModelGenerator Page Component
 * Main workflow for generating and visualizing 3D engineering models
 * Now includes AI-powered natural language generation
 */
export default function ModelGenerator() {
  // ============================================
  // State Management
  // ============================================

  // Generated model with geometry data
  const [generatedModel, setGeneratedModel] = useState(null);

  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  // Error messages for user feedback
  const [error, setError] = useState(null);

  // Generation time for performance monitoring
  const [generationTime, setGenerationTime] = useState(null);

  // List of all generated models
  const [modelList, setModelList] = useState([]);

  // Parsed parameters from natural language (for display)
  const [parsedParams, setParsedParams] = useState(null);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handle natural language generation (AI-powered)
   * @param {string} text - Natural language description
   */
  const handleGenerateFromText = async (text) => {
    setLoading(true);
    setError(null);
    setGenerationTime(null);
    setParsedParams(null);

    const startTime = performance.now();

    try {
      console.log("[ModelGenerator] Generating from text:", text);

      // Call AI-powered text generation
      const result = await modelService.generateFromText(text);

      // Calculate generation time
      const endTime = performance.now();
      const time = (endTime - startTime).toFixed(2);
      setGenerationTime(time);

      // Store generated model and parsed parameters
      setGeneratedModel(result.model);
      setParsedParams(result.parsedParams);

      console.log(
        `[ModelGenerator] Text-based generation successful in ${time}ms`,
        result,
      );
    } catch (err) {
      const errorMessage = err.message || "Failed to generate from text";
      console.error("[ModelGenerator] Text generation error:", errorMessage);

      setError(errorMessage);

      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle model generation when user submits form
   * @param {Object} formData - Form data from ModelForm component
   */
  const handleGenerateModel = async (formData) => {
    setLoading(true);
    setError(null);
    setGenerationTime(null);
    setParsedParams(null);

    const startTime = performance.now();

    try {
      console.log("[ModelGenerator] Generating model with data:", formData);

      // Call API service to generate model
      const model = await modelService.generateModel(formData);

      // Calculate generation time
      const endTime = performance.now();
      const time = (endTime - startTime).toFixed(2);
      setGenerationTime(time);

      // Store generated model in state
      setGeneratedModel(model);

      console.log(
        `[ModelGenerator] Model generated successfully in ${time}ms`,
        model,
      );

      // Show success feedback
      if (model.id) {
        console.log(`[ModelGenerator] Model ID: ${model.id}`);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to generate model";
      console.error("[ModelGenerator] Generation error:", errorMessage);

      // Display error to user
      setError(errorMessage);

      // Keep error visible for 5 seconds, then auto-dismiss
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle model export to file
   * @param {string} format - Export format (glb, gltf, obj)
   */
  const handleExportModel = async (format = "glb") => {
    if (!generatedModel) {
      setError("No model to export. Generate a model first.");
      return;
    }

    try {
      console.log(`[ModelGenerator] Exporting model as ${format}`);
      setLoading(true);
      setError(null);

      // Call export API
      const blob = await modelService.exportModel(generatedModel.id, format);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `model_${generatedModel.id}.${format}`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`[ModelGenerator] Model exported successfully as ${format}`);
    } catch (err) {
      const errorMessage = err.message || `Failed to export model as ${format}`;
      console.error("[ModelGenerator] Export error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all previously generated models
   */
  const handleLoadModels = async () => {
    try {
      console.log("[ModelGenerator] Loading model list...");
      setLoading(true);
      setError(null);

      const models = await modelService.listModels();
      setModelList(models);

      console.log(`[ModelGenerator] Loaded ${models.length} models`);
    } catch (err) {
      const errorMessage = err.message || "Failed to load models";
      console.error("[ModelGenerator] Load error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load a previously generated model for preview
   * @param {string} modelId - Model ID to load
   */
  const handleLoadModel = async (modelId) => {
    try {
      console.log("[ModelGenerator] Loading model:", modelId);
      setLoading(true);
      setError(null);

      const model = await modelService.getModel(modelId);
      setGeneratedModel(model);

      console.log("[ModelGenerator] Model loaded successfully");
    } catch (err) {
      const errorMessage = err.message || "Failed to load model";
      console.error("[ModelGenerator] Load model error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear current model and reset state
   */
  const handleClearModel = () => {
    setGeneratedModel(null);
    setError(null);
    setGenerationTime(null);
    console.log("[ModelGenerator] Model cleared");
  };

  // ============================================
  // Render
  // ============================================

  return (
    <div className="model-generator">
      <div className="generator-container">
        {/* ========== Form Section ========== */}
        <div className="form-section">
          <h2>🔧 Model Configuration</h2>

          {/* Error Message Alert */}
          {error && (
            <div
              className="error-message"
              style={{
                background: "#ff4444",
                color: "white",
                padding: "12px 15px",
                borderRadius: "4px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>⚠️ {error}</span>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "3px",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* AI-Powered Natural Language Input */}
          <NaturalLanguageInput
            onGenerate={handleGenerateFromText}
            isLoading={loading}
          />

          {/* Parsed Parameters Display (if from NL generation) */}
          {parsedParams && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px",
                background: "rgba(138, 43, 226, 0.1)",
                border: "1px solid rgba(138, 43, 226, 0.3)",
                borderRadius: "6px",
                fontSize: "0.9rem",
              }}
            >
              <strong style={{ color: "#8a2be2" }}>
                🎯 Parsed Parameters:
              </strong>
              <div style={{ marginTop: "8px", color: "#bbb" }}>
                <div>Type: {parsedParams.modelType}</div>
                <div>Material: {parsedParams.material}</div>
                <div>Complexity: {parsedParams.complexity}</div>
                <div>
                  Dimensions: {parsedParams.dimensions.width}mm ×{" "}
                  {parsedParams.dimensions.height}mm ×{" "}
                  {parsedParams.dimensions.depth}mm
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              margin: "20px 0",
              padding: "10px 0",
              borderTop: "1px solid rgba(74, 158, 255, 0.2)",
              borderBottom: "1px solid rgba(74, 158, 255, 0.2)",
              textAlign: "center",
              color: "#666",
              fontSize: "0.85rem",
            }}
          >
            OR use manual configuration below
          </div>

          {/* Model Form Component */}
          <ModelForm onSubmit={handleGenerateModel} isLoading={loading} />

          {/* Generation Time Display */}
          {generationTime && (
            <div
              style={{
                marginTop: "12px",
                padding: "8px",
                background: "#e8f5e9",
                color: "#2e7d32",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              ✓ Generated in {generationTime}ms
            </div>
          )}

          {/* Action Buttons */}
          {generatedModel && (
            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleLoadModels()}
                disabled={loading}
                style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
              >
                📋 Load Models
              </button>
              <button
                onClick={handleClearModel}
                disabled={loading}
                style={{
                  flex: 1,
                  background: "#666",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                🗑️ Clear
              </button>
            </div>
          )}
        </div>

        {/* ========== Viewer Section ========== */}
        <div className="viewer-section">
          <h2>👁️ 3D Preview</h2>

          {/* Loading Spinner */}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "#999",
                fontSize: "1.2rem",
              }}
            >
              <div className="spinner" style={{ marginRight: "10px" }}>
                ⟳
              </div>
              Generating model...
            </div>
          )}

          {/* Model Viewer */}
          {!loading && generatedModel ? (
            <>
              <ModelViewer model={generatedModel} />

              {/* Export Controls */}
              <div className="export-controls">
                <button
                  onClick={() => handleExportModel("glb")}
                  disabled={loading}
                  title="Export as OpenGL Transmission Format (Binary)"
                >
                  📦 Export as GLB
                </button>
                <button
                  onClick={() => handleExportModel("gltf")}
                  disabled={loading}
                  title="Export as OpenGL Transmission Format (JSON)"
                >
                  📄 Export as glTF
                </button>
                <button
                  onClick={() => handleExportModel("obj")}
                  disabled={loading}
                  title="Export as Wavefront OBJ format"
                >
                  🔶 Export as OBJ
                </button>
              </div>

              {/* Model Information */}
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  background: "rgba(74, 158, 255, 0.1)",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  color: "#aaa",
                }}
              >
                <strong>Model ID:</strong> {generatedModel.id}
                <br />
                <strong>Type:</strong> {generatedModel.modelType}
                <br />
                <strong>Material:</strong> {generatedModel.material}
              </div>
            </>
          ) : !loading ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎯</div>
              <p>Configure and generate a model to see preview</p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                Fill out the form on the left and click "Generate Model"
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ========== Model List Modal (Optional) ========== */}
      {modelList.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            border: "1px solid rgba(74, 158, 255, 0.2)",
          }}
        >
          <h3>📁 Recent Models ({modelList.length})</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {modelList.map((model) => (
              <button
                key={model.id}
                onClick={() => handleLoadModel(model.id)}
                disabled={loading}
                style={{
                  padding: "10px",
                  background: "rgba(74, 158, 255, 0.2)",
                  border: "1px solid rgba(74, 158, 255, 0.4)",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <strong>{model.modelType}</strong>
                <br />
                <small style={{ color: "#999" }}>{model.material}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spinner Animation CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
