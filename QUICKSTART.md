# 3D Engineering Model Generator - Quick Start Guide

## What's Included

This is a complete full-stack project with:

- **Frontend**: React + Vite with Three.js 3D rendering
- **Backend**: Node.js Express REST API
- **AI Modules**: Geometry generation and optimization algorithms
- **Example Components**: Ready-to-use form, viewer, and generator
- **Documentation**: Architecture, development guide, and API specs

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start All Services

```bash
npm start
```

Or run separately in different terminals:

- Frontend: `npm run dev:frontend`
- Backend: `npm run dev:backend`
- AI Modules: `npm run dev:ai`

### 3. Open Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 4. Test Generation

1. Fill in the Model Configuration form
2. Click "Generate Model"
3. See 3D preview in the ModelViewer
4. Export in GLB, glTF, or OBJ format

## File Organization

```
project/
├── frontend/              # React application
│   ├── src/components/   # UI components
│   ├── src/pages/        # Page components
│   └── src/services/     # API calls
├── backend/              # Express server
│   ├── src/routes/       # API endpoints
│   ├── src/controllers/  # Request handlers
│   └── src/services/     # Business logic
├── ai-modules/           # AI & geometry
│   ├── src/generators/   # Model algorithms
│   └── src/utils/        # Helper functions
└── Documentation/        # Guides
```

## Key Features

✅ **Model Types**: Gear, Bearing, Bracket, Shaft, Custom
✅ **Complexity Levels**: Simple to Advanced
✅ **Multiple Materials**: Steel, Aluminum, Titanium, Plastic, Composite
✅ **3D Visualization**: Interactive Three.js preview
✅ **Export Formats**: GLB, glTF, OBJ
✅ **Geometry Calculations**: Volume, surface area, mass estimation

## API Endpoints

| Method | Endpoint                 | Purpose            |
| ------ | ------------------------ | ------------------ |
| POST   | `/api/models/generate`   | Create new model   |
| GET    | `/api/models`            | List all models    |
| GET    | `/api/models/:id`        | Get specific model |
| GET    | `/api/models/export/:id` | Export model       |
| GET    | `/api/health`            | Health check       |

## Development

### Next Steps

1. **Add Database**: Replace in-memory storage in `backend/src/services/modelService.js`
2. **Real 3D Export**: Implement actual GLB/glTF conversion
3. **Authentication**: Add user login and project management
4. **Advanced AI**: Implement machine learning for design optimization
5. **CAD Import**: Support STEP and IGES file import

### Testing Endpoints

Using curl:

```bash
# Generate model
curl -X POST http://localhost:5000/api/models/generate \
  -H "Content-Type: application/json" \
  -d '{
    "modelName": "Test Gear",
    "modelType": "gear",
    "complexity": "medium",
    "dimensions": {"width": 100, "height": 50, "depth": 50},
    "material": "steel"
  }'

# List models
curl http://localhost:5000/api/models

# Health check
curl http://localhost:5000/api/health
```

## Folder Structure Details

### Frontend (`frontend/src/`)

- **components/** - Reusable UI components (ModelForm, ModelViewer, etc.)
- **pages/** - Full page components (ModelGenerator)
- **services/** - API service layer (modelService)
- **utils/** - Helper functions (helpers)

### Backend (`backend/src/`)

- **routes/** - Route definitions (models.js)
- **controllers/** - Request handlers (modelController.js)
- **services/** - Business logic (modelService.js)
- **middleware/** - Middleware (errorHandler.js)

### AI Modules (`ai-modules/src/`)

- **generators/** - Model generation (ModelGenerator.js)
- **models/** - Data models (MaterialLibrary.js)
- **utils/** - Geometry utilities (GeometryUtils.js)

## Configuration

### Backend Environment Variables (`backend/.env`)

```
PORT=3001              # Server port
NODE_ENV=development   # Environment
```

### Frontend Config (`frontend/vite.config.js`)

- Development server on port 3000
- API proxy to backend on port 3001

## package.json Scripts

| Script                   | Purpose          |
| ------------------------ | ---------------- |
| `npm start`              | Run all services |
| `npm run dev:frontend`   | Frontend only    |
| `npm run dev:backend`    | Backend only     |
| `npm run dev:ai`         | AI modules only  |
| `npm run build`          | Build all        |
| `npm run build:frontend` | Build frontend   |
| `npm run build:backend`  | Build backend    |
| `npm run build:ai`       | Build AI         |

## Troubleshooting

**Port 3000/3001 already in use?**

```bash
lsof -i :3000
kill -9 <PID>
```

**Dependencies not installing?**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**API not responding?**

- Check backend is running: `npm run dev:backend`
- Verify port 3001 is accessible
- Check CORS configuration in `backend/src/index.js`

## Documentation Files

- **README.md** - Main project documentation
- **ARCHITECTURE.md** - System design and data flow
- **DEVELOPMENT.md** - Development guide and best practices
- **QUICKSTART.md** - This file

## Resources

- React: https://react.dev
- Three.js: https://threejs.org
- Express.js: https://expressjs.com
- Vite: https://vitejs.dev

## Next Development Steps

1. ✅ Create basic project structure
2. ✅ Implement frontend UI
3. ✅ Set up Express API
4. ✅ Add 3D rendering
5. ⏳ Add database integration
6. ⏳ Implement user authentication
7. ⏳ Add advanced AI features
8. ⏳ Production deployment

## Support

For questions or issues:

1. Check DEVELOPMENT.md for detailed guides
2. Review ARCHITECTURE.md for system design
3. Examine example files in each module
4. Check console for error messages

---

**Ready to build? Start with `npm install` then `npm start`!**
