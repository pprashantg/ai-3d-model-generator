# 3D Engineering Model Generator

A full-stack application for generating, visualizing, and exporting 3D engineering models using AI-powered algorithms and Three.js rendering.

## Project Overview

This project consists of three main components:

- **Frontend**: React + Vite + Three.js for interactive 3D visualization
- **Backend**: Node.js + Express REST API for model generation and management
- **AI Modules**: Geometry generation and optimization algorithms

## Technology Stack

### Frontend

- React 18.2
- Vite (bundler)
- Three.js (3D rendering)
- Axios (HTTP client)

### Backend

- Node.js
- Express.js
- CORS enabled
- RESTful API

### AI/Geometry

- Custom geometry generation algorithms
- Material property calculations
- 3D printing optimization

## Project Structure

```
.
├── frontend/                  # React front-end application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Node.js Express back-end
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Custom middleware
│   │   └── index.js          # Entry point
│   ├── .env
│   └── package.json
│
├── ai-modules/               # AI and geometry generation
│   ├── src/
│   │   ├── generators/       # Model generation algorithms
│   │   ├── models/           # Data models
│   │   ├── utils/            # Geometry utilities
│   │   └── index.js
│   └── package.json
│
└── package.json              # Root workspace configuration
```

## Features

### Model Generation

- Multiple model types: Gear, Bearing, Bracket, Shaft
- Customizable dimensions and complexity levels
- Material property support

### 3D Visualization

- Real-time interactive 3D preview
- Automatic model rotation
- Responsive viewport

### Export Capabilities

- Export in GLB format
- Export in glTF format
- Export in OBJ format

### AI Modules

- Geometry calculations (volume, surface area)
- Mass estimation based on material
- Support structure generation for 3D printing
- Geometry validation

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
cd /path/to/project
```

2. Install dependencies for all workspaces:

```bash
npm install
```

### Development

Start all services in development mode:

```bash
npm start
```

Or run services individually:

**Frontend (port 3000):**

```bash
npm run dev:frontend
```

**Backend (port 3001):**

```bash
npm run dev:backend
```

**AI Modules:**

```bash
npm run dev:ai
```

### Building

Build all components:

```bash
npm run build
```

Or build individual components:

```bash
npm run build:frontend
npm run build:backend
npm run build:ai
```

## API Documentation

### Model Generation

- **Endpoint**: `POST /api/models/generate`
- **Body**: Model specification (name, type, dimensions, material, description)
- **Response**: Generated model object with ID and geometry

### Get Model

- **Endpoint**: `GET /api/models/:id`
- **Response**: Model object

### List Models

- **Endpoint**: `GET /api/models`
- **Response**: Array of all generated models

### Export Model

- **Endpoint**: `GET /api/models/export/:id?format=glb`
- **Query Parameters**: `format` (glb, gltf, obj)
- **Response**: Binary model file

### Health Check

- **Endpoint**: `GET /api/health`
- **Response**: API status

## Component Details

### Frontend Components

**ModelGenerator Page**

- Main page component
- Handles form submission and model preview
- Manages export functionality

**ModelForm Component**

- Configuration form for model parameters
- Input validation
- Type selection

**ModelViewer Component**

- Three.js 3D visualization
- Automatic model rotation
- Responsive canvas

### Backend Services

**modelService**

- In-memory model storage (replace with database)
- Model generation logic
- Export functionality

**Model Controller**

- Request handling
- Response formatting

## Configuration

### Backend Environment Variables

Create `backend/.env`:

```
PORT=3001
NODE_ENV=development
```

### Frontend Development Server

The frontend is configured to proxy API requests to the backend via `vite.config.js`.

## Model Types

1. **Gear**: Mechanical gear with configurable tooth count
2. **Bearing**: Radial bearing with ball arrangement
3. **Bracket**: Box-shaped support structure
4. **Shaft**: Cylindrical rotating element
5. **Custom**: User-defined geometry

## Complexity Levels

- **Simple**: Basic geometry, minimal details
- **Medium**: Standard complexity, moderate details
- **Complex**: High detail, advanced features
- **Advanced**: Maximum complexity, specialized geometry

## Materials Supported

- Steel (7.85 g/cm³)
- Aluminum (2.7 g/cm³)
- Titanium (4.54 g/cm³)
- Plastic (1.2 g/cm³)
- Composite (1.6 g/cm³)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Advanced AI model optimization
- [ ] CAD file import/export (STEP, IGES)
- [ ] Real-time collaboration features
- [ ] Material simulation and analysis
- [ ] Assembly visualization
- [ ] User authentication and project management
- [ ] Machine learning for automatic design optimization

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Last Updated**: March 2026
