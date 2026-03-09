import { useState } from "react";
import "./NaturalLanguageInput.css";

/**
 * NaturalLanguageInput Component
 * AI-powered natural language interface for model generation
 *
 * Example inputs:
 * - "Generate a titanium gear with 24 teeth and radius 10 cm"
 * - "Create a steel bracket 100mm x 50mm x 30mm"
 * - "Make an aluminum bearing with 5cm diameter"
 */
export default function NaturalLanguageInput({ onGenerate, isLoading }) {
  const [text, setText] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const examplePrompts = [
    "Generate a titanium gear with 24 teeth and radius 10 cm",
    "Create a steel bracket 100mm x 50mm x 30mm",
    "Make an aluminum bearing with 5cm diameter",
    "Build a complex plastic shaft 200mm long",
    "Simple steel gear with 12 teeth",
    "Advanced composite bracket with 4 mounting holes",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onGenerate(text.trim());
    }
  };

  const handleExampleClick = (example) => {
    setText(example);
    setShowExamples(false);
  };

  const handleKeyDown = (e) => {
    // Submit on Cmd+Enter or Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="natural-language-input">
      <div className="nl-header">
        <h3>🤖 AI-Powered Generation</h3>
        <p>Describe your model in natural language</p>
      </div>

      <form onSubmit={handleSubmit} className="nl-form">
        <div className="nl-textarea-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="E.g., Generate a titanium gear with 24 teeth and radius 10 cm..."
            rows={4}
            disabled={isLoading}
            className="nl-textarea"
          />

          {text.length > 0 && (
            <div className="nl-char-count">{text.length} characters</div>
          )}
        </div>

        <div className="nl-actions">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="nl-examples-btn"
            disabled={isLoading}
          >
            💡 Examples
          </button>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="nl-generate-btn"
          >
            {isLoading ? "⚙️ Generating..." : "🚀 Generate from Text"}
          </button>
        </div>
      </form>

      {showExamples && (
        <div className="nl-examples">
          <h4>Example Prompts:</h4>
          <div className="nl-examples-grid">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="nl-example-item"
                disabled={isLoading}
              >
                <span className="nl-example-icon">✨</span>
                <span className="nl-example-text">{example}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="nl-hint">
        <span className="nl-hint-icon">💡</span>
        <span>
          Tip: Press <kbd>Cmd+Enter</kbd> to generate quickly
        </span>
      </div>
    </div>
  );
}
