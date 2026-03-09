import { useState } from "react";
import "./ModelForm.css";

export default function ModelForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    modelName: "Mechanical Part",
    modelType: "gear",
    complexity: "medium",
    dimensions: {
      width: 100,
      height: 100,
      depth: 100,
    },
    material: "steel",
    description: "A custom engineered part",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="model-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="modelName">Model Name</label>
        <input
          type="text"
          id="modelName"
          name="modelName"
          value={formData.modelName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="modelType">Model Type</label>
        <select
          id="modelType"
          name="modelType"
          value={formData.modelType}
          onChange={handleChange}
        >
          <option value="gear">Gear</option>
          <option value="bearing">Bearing</option>
          <option value="bracket">Bracket</option>
          <option value="housing">Housing</option>
          <option value="shaft">Shaft</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="complexity">Complexity Level</label>
        <select
          id="complexity"
          name="complexity"
          value={formData.complexity}
          onChange={handleChange}
        >
          <option value="simple">Simple</option>
          <option value="medium">Medium</option>
          <option value="complex">Complex</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="dimensions">
        <h4>Dimensions (mm)</h4>
        <div className="form-group">
          <label htmlFor="width">Width</label>
          <input
            type="number"
            id="width"
            name="dimensions.width"
            value={formData.dimensions.width}
            onChange={handleChange}
            min="1"
            max="1000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">Height</label>
          <input
            type="number"
            id="height"
            name="dimensions.height"
            value={formData.dimensions.height}
            onChange={handleChange}
            min="1"
            max="1000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="depth">Depth</label>
          <input
            type="number"
            id="depth"
            name="dimensions.depth"
            value={formData.dimensions.depth}
            onChange={handleChange}
            min="1"
            max="1000"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="material">Material</label>
        <select
          id="material"
          name="material"
          value={formData.material}
          onChange={handleChange}
        >
          <option value="steel">Steel</option>
          <option value="aluminum">Aluminum</option>
          <option value="titanium">Titanium</option>
          <option value="plastic">Plastic</option>
          <option value="composite">Composite</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <button type="submit" disabled={isLoading} className="generate-btn">
        {isLoading ? "Generating..." : "Generate Model"}
      </button>
    </form>
  );
}
