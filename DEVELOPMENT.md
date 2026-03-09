# Development Guide

## Setting Up Development Environment

### Prerequisites

- Node.js 16+ and npm
- Git
- A code editor (VS Code recommended)
- Understanding of React, Node.js, and Three.js basics

### Initial Setup

1. **Install dependencies:**

```bash
npm install
```

This will install dependencies for all workspaces (frontend, backend, ai-modules).

2. **Configure environment:**

Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

3. **Verify installation:**

```bash
npm run dev
```

All three services should start successfully.

## Development Workflow

### Running Services

**Option 1: Run all services together**

```bash
npm start
```

**Option 2: Run services individually in separate terminals**

Terminal 1 - Frontend (port 3000):

```bash
npm run dev:frontend
```

Terminal 2 - Backend (port 3001):

```bash
npm run dev:backend
```

Terminal 3 - AI Modules:

```bash
npm run dev:ai
```

### Frontend Development

**File Structure:**

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page-level components
│   ├── services/        # API service layer
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── styles.css       # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json
```

**Creating a new component:**

```jsx
// frontend/src/components/NewComponent.jsx
import "./NewComponent.css";

export default function NewComponent() {
  return <div className="new-component">{/* Component content */}</div>;
}
```

**Styling:**

- Use CSS modules or CSS files
- Follow BEM naming convention: `.component-name__element--modifier`

**Calling API:**

```javascript
// frontend/src/services/modelService.js
const response = await fetch("http://localhost:5000/api/models/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

### Backend Development

**File Structure:**

```
backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   └── index.js          # Main server file
├── .env                  # Environment variables
└── package.json
```

**Creating a new route:**

1. **Create controller** (`backend/src/controllers/newController.js`):

```javascript
export async function newHandler(req, res, next) {
  try {
    // Handle request
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
```

2. **Add route** (`backend/src/routes/newRoutes.js`):

```javascript
import express from "express";
import * as controller from "../controllers/newController.js";

const router = express.Router();
router.post("/action", controller.newHandler);

export default router;
```

3. **Register in main server** (`backend/src/index.js`):

```javascript
import newRoutes from "./routes/newRoutes.js";
app.use("/api/new", newRoutes);
```

**Environment Variables:**
Define in `backend/.env`:

```
PORT=3001
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/db
```

Access in code:

```javascript
const port = process.env.PORT || 3001;
```

### AI Modules Development

**File Structure:**

```
ai-modules/
├── src/
│   ├── generators/       # Model generation algorithms
│   ├── models/           # Data models and libraries
│   ├── utils/            # Utility functions
│   └── index.js          # Module export
└── package.json
```

**Creating a new generator:**

1. **Extend ModelGenerator** or create new generator class:

```javascript
export class AdvancedGenerator {
  generate(spec) {
    // Implementation
    return model;
  }
}
```

2. **Add to exports** (`ai-modules/src/index.js`):

```javascript
export { AdvancedGenerator } from "./generators/AdvancedGenerator.js";
```

3. **Use in backend**:

```javascript
import { AdvancedGenerator } from "../ai-modules/src/generators/AdvancedGenerator.js";
```

## Code Style Guidelines

### JavaScript/React

- Use ES6+ syntax
- Use functional components with hooks
- Use descriptive variable names
- Add JSDoc comments for functions

Example:

```javascript
/**
 * Fetch and display model data
 * @param {string} modelId - The model ID
 * @returns {Promise<Object>} Model data
 */
async function fetchModel(modelId) {
  // Implementation
}
```

### Naming Conventions

- Components: PascalCase (`ModelViewer.jsx`)
- Functions: camelCase (`generateModel()`)
- Constants: UPPER_SNAKE_CASE (`MAX_DIMENSION = 1000`)
- Classes: PascalCase (`ModelGenerator`)
- Files: lowercase with hyphens or PascalCase for components

## Testing

### Manual Testing

1. Start all services
2. Test endpoints using curl or Postman
3. Test UI interactions in browser

Example API test:

```bash
curl -X POST http://localhost:5000/api/models/generate \
  -H "Content-Type: application/json" \
  -d '{
    "modelName": "Test Gear",
    "modelType": "gear",
    "complexity": "medium",
    "dimensions": {"width": 100, "height": 50, "depth": 50}
  }'
```

### Browser Debugging

- Open http://localhost:3000 in browser
- Use Chrome DevTools (F12)
- Check Console for errors
- Use React DevTools extension

## Debugging

### Frontend

- Set breakpoints in DevTools
- Use `console.log()` and `console.error()`
- Use React DevTools extension

### Backend

- Use `node --inspect` flag for debugging
- Set process.env.DEBUG = '\*' for detailed logs
- Check terminal output for errors

## Common Tasks

### Add a New Model Type

1. **Update ModelGenerator** (`ai-modules/src/generators/ModelGenerator.js`):

```javascript
generateNewTypeGeometry(dimensions, complexity) {
  // Implementation
}
```

2. **Update ModelForm** (`frontend/src/components/ModelForm.jsx`):

```jsx
<select name="modelType">
  <option value="newtype">New Type</option>
</select>
```

3. **Update MaterialLibrary** if needed (`ai-modules/src/models/MaterialLibrary.js`)

### Add a New API Endpoint

1. Create controller function
2. Create route file
3. Register in main server
4. Update frontend service
5. Update UI to call new endpoint

### Optimize Performance

- Use React.memo() for components that don't change
- Implement useCallback for event handlers
- Optimize Three.js renderer (reduce poly count)
- Add loading states and error boundaries

## Build Preparation

### Before Deployment

1. `npm run lint` - Check code quality
2. `npm run build` - Build all components
3. Test production build locally
4. Check bundle sizes
5. Run security audit: `npm audit`

### Building for Production

```bash
npm run build:frontend
npm run build:backend
npm run build:ai
```

Outputs:

- Frontend: `frontend/dist/`
- Backend: Ready as-is
- AI Modules: Ready as-is

## Environment-Specific Configuration

### Development (.env)

```
PORT=3001
NODE_ENV=development
DEBUG=*
```

### Production (.env.production)

```
PORT=3001
NODE_ENV=production
DEBUG=
```

## Troubleshooting

### Port Already in Use

```bash
lsof -i :3001  # Find process
kill -9 <PID>  # Kill process
```

### Module Not Found

```bash
rm -rf node_modules
npm install
```

### Build Errors

```bash
npm cache clean --force
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

## Resources

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [Vite Documentation](https://vitejs.dev)

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

Follow the code style guidelines and ensure all services run without errors.
