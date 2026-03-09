# AI Modules

AI and geometry generation modules for the 3D Engineering Model Generator.

## Features

- Model generation based on specifications
- Geometry calculations and optimizations
- Material properties library
- Support structure generation for 3D printing
- Geometry validation

## Project Structure

- `src/generators/` - Model generation algorithms
- `src/models/` - Data models and libraries
- `src/utils/` - Utility functions for geometry operations

## Key Classes

### ModelGenerator

Generates 3D models based on type and specifications.

```javascript
import ModelGenerator from "./generators/ModelGenerator.js";

const generator = new ModelGenerator();
const model = generator.generate({
  modelType: "gear",
  dimensions: { width: 100, height: 50, depth: 50 },
  material: "steel",
  complexity: "medium",
});
```

### GeometryUtils

Collection of geometry calculation and optimization functions.

```javascript
import GeometryUtils from "./utils/GeometryUtils.js";

const volume = GeometryUtils.calculateVolume(geometry);
const mass = GeometryUtils.calculateMass(geometry, "aluminum");
```

## Getting Started

```bash
npm install
npm run dev
```
