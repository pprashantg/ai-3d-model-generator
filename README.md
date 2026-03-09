# 🤖 AI-Powered 3D Model Generator for Engineering

An intelligent full-stack web application that generates **parametric 3D engineering models** from either manual parameters or **natural language prompts**.

The system combines **React, Node.js, NLP, and Three.js** to simplify mechanical model generation and visualization.

---

# 🚀 Features

✅ AI Prompt → 3D Model Generation  
✅ Natural Language Processing for engineering commands  
✅ Parametric model configuration  
✅ Real-time interactive 3D viewer  
✅ Auto-centering and smart camera positioning  
✅ Export models in **GLB, glTF, OBJ** formats  
✅ Advanced Three.js viewer (grid, axis helpers, lighting)

---

# 🧠 Example AI Prompts

Users can type commands like:


Create a steel gear with 24 teeth and 50mm diameter

Generate an aluminum bracket 100mm x 50mm x 30mm

Build a plastic shaft 200mm long


The system automatically extracts:

- Model Type
- Material
- Dimensions
- Complexity
- Engineering parameters

---

# 🏗️ System Architecture


User Prompt / Parameters
↓
React Frontend (UI)
↓
Axios API Service
↓
Node.js + Express Backend
↓
NLP Parser (Parameter Extraction)
↓
Geometry Engine
↓
Three.js Viewer
↓
3D Model Export (GLB / OBJ / glTF)


---

# 🛠️ Tech Stack

### Frontend
- React
- Axios
- Three.js
- CSS

### Backend
- Node.js
- Express.js
- Natural Language Parser

### 3D Rendering
- Three.js
- WebGL

---

# 📸 Screenshots

### AI Prompt Interface
![AI Prompt](screenshots/ai-input.png)

### Generated 3D Model
![3D Viewer](screenshots/model-viewer.png)

### Export Controls
![Export Panel](screenshots/export-options.png)

---

# ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-3d-model-generator.git
Install Backend
cd backend
npm install
npm run dev
Install Frontend
cd frontend
npm install
npm start
📦 API Endpoints

Generate Model

POST /api/models/generate

Generate from AI Prompt

POST /api/models/generate-from-text

Export Model

GET /api/models/export/:id
🎯 Project Goals

This project demonstrates how AI-assisted interfaces can simplify parametric engineering design and make 3D modeling faster, more intuitive, and accessible.

🔮 Future Improvements

AI-assisted parametric editing

STL export for 3D printing

AI sketch → 3D model generation

Cloud model storage

Real-time collaborative editing

👨‍💻 Author

Your Name

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

⭐ If you like this project

Give it a star on GitHub to support the project!
