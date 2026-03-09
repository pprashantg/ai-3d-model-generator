# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Three.js)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ModelGenerator Page                                 │  │
│  │  ├── ModelForm (Configuration)                       │  │
│  │  └── ModelViewer (3D Preview)                        │  │
│  │      └── Three.js Scene                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ▲                                    │
│                         │ HTTP/REST                          │
│                         ▼                                    │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────┴──────────────────────────────────┐
│                  Backend (Node.js + Express)               │
│  ┌────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/models/*)                        │   │
│  │  ├── POST /generate → ModelController              │   │
│  │  ├── GET /:id → ModelController                    │   │
│  │  ├── GET / → ModelController                       │   │
│  │  └── GET /export/:id → ModelController             │   │
│  └────────────────────────────────────────────────────┘   │
│                         ▲                                   │
│                         │                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Services Layer (modelService)                      │   │
│  │  ├── generateModel()                               │   │
│  │  ├── getModel()                                    │   │
│  │  ├── listModels()                                  │   │
│  │  └── exportModel()                                 │   │
│  └────────────────────────────────────────────────────┘   │
│                         ▲                                   │
│                         │                                   │
└─────────────────────────┼──────────────────────────────────┘
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
┌──────────────────────┐         ┌──────────────────────┐
│   AI Modules         │         │   Data Storage       │
│                      │         │   (In-memory         │
│ ┌────────────────┐  │         │    or Database)      │
│ │ModelGenerator  │  │         │                      │
│ │- generate()    │  │         │  Models Map          │
│ │- getGeo()      │  │         │  (to be replaced)    │
│ └────────────────┘  │         │                      │
│                      │         │                      │
│ ┌────────────────┐  │         └──────────────────────┘
│ │GeometryUtils   │  │
│ │- volume()      │  │
│ │- surface()     │  │
│ │- mass()        │  │
│ └────────────────┘  │
│                      │
│ ┌────────────────┐  │
│ │MaterialLib     │  │
│ │- materials     │  │
│ └────────────────┘  │
└──────────────────────┘
```

## Data Flow

### Model Generation Flow

1. **User Input** → Frontend (ModelForm)
2. **API Request** → Backend (POST /api/models/generate)
3. **Processing** → ModelGenerator AI module
4. **Storage** → In-memory models map
5. **Response** → Frontend with model data
6. **Visualization** → Three.js preview

### Export Flow

1. **User Action** → Frontend export button
2. **API Request** → Backend (GET /api/models/export)
3. **Processing** → modelService.exportModel()
4. **Formatting** → Convert to requested format
5. **Download** → Binary file to user

## Module Responsibilities

### Frontend Module

- User interface and interactions
- Form validation (client-side)
- 3D visualization with Three.js
- HTTP communication with backend

### Backend Module

- RESTful API endpoints
- Request validation
- Middleware management (CORS, error handling)
- Service orchestration
- Response formatting

### AI Modules

- Model generation algorithms
- Geometry calculations
- Material properties
- Optimization functions
- Validation logic

## Scalability Considerations

### Current State

- In-memory model storage
- Synchronous processing
- Single-machine deployment

### For Production

- Replace with database (MongoDB/PostgreSQL)
- Implement message queues for async processing
- Add caching layer (Redis)
- Load balancing
- Containerization (Docker)
- Microservices architecture

## Security Considerations

1. **Input Validation**: Sanitize and validate all user inputs
2. **CORS**: Properly configured for cross-origin requests
3. **Error Handling**: Don't expose sensitive info in errors
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Authentication**: Add user authentication for future features
6. **File Uploads**: Validate file sizes and types

## Performance Optimization

1. **Frontend**
   - Code splitting with Vite
   - Lazy loading components
   - Optimize Three.js renderer

2. **Backend**
   - Database indexing
   - Query optimization
   - Response caching
   - Batch processing

3. **AI Modules**
   - Parallel geometry calculation
   - Memoization of calculations
   - Geometry simplification for export
