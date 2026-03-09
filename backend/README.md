# Backend

Node.js Express backend for the 3D Engineering Model Generator.

## Features

- RESTful API for model generation
- Model persistence and retrieval
- Export functionality (GLB, glTF, OBJ)
- Error handling and logging

## Project Structure

- `src/routes/` - API route handlers
- `src/controllers/` - Request/response handlers
- `src/services/` - Business logic
- `src/middleware/` - Custom middleware

## Getting Started

```bash
npm install
npm run dev
```

## API Endpoints

- `POST /api/models/generate` - Generate a new 3D model
- `GET /api/models/:id` - Get model by ID
- `GET /api/models` - List all models
- `GET /api/models/export/:id` - Export model in specified format

## Environment Variables

Create a `.env` file:

```
PORT=3001
NODE_ENV=development
```
