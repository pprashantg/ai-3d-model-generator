import { useState } from "react";
import ModelGenerator from "./pages/ModelGenerator";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>3D Engineering Model Generator</h1>
        <p>Generate complex 3D models using AI</p>
      </header>
      <main className="app-main">
        <ModelGenerator />
      </main>
    </div>
  );
}

export default App;
