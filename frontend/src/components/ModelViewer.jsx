import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ModelViewer Component
 * Renders 3D engineering geometry using Three.js
 *
 * Features:
 * - Auto-centered model
 * - Intelligent camera positioning
 * - Orbit controls for interaction
 * - Wireframe visualization
 * - Responsive canvas
 * - Proper resource cleanup
 *
 * @param {Object} model - Model data with geometry
 * @param {Object} model.geometry - Generated geometry {nodes, edges, faces}
 * @param {string} model.modelType - Type of model
 */
export default function ModelViewer({ model }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !model) return;

    console.log("[ModelViewer] Initializing scene for model:", model.modelType);

    // ============================================
    // Scene Setup
    // ============================================

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // ============================================
    // Camera Setup
    // ============================================

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    cameraRef.current = camera;

    // ============================================
    // Renderer Setup
    // ============================================

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ============================================
    // Lighting Setup
    // ============================================

    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional light for shadows and depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    // Fill light from opposite direction
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-10, -5, -15);
    scene.add(fillLight);

    // ============================================
    // Grid Helper & Axis Helper (positioned later after model sizing)
    // ============================================

    const gridHelper = new THREE.GridHelper(500, 50, 0x666666, 0x333333);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.8;
    scene.add(gridHelper);

    const axisHelper = new THREE.AxesHelper(150);
    scene.add(axisHelper);

    // ============================================
    // Create Geometry Objects
    // ============================================

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    // Create mesh surfaces from geometry data
    if (model.geometry && model.geometry.nodes) {
      console.log("[ModelViewer] Creating geometry from backend data");

      const bufferGeometry = createGeometryFromData(model.geometry);
      const material = new THREE.MeshPhongMaterial({
        color: 0x4a9eff,
        emissive: 0x1a5a8a,
        side: THREE.DoubleSide,
        shininess: 100,
        flatShading: false,
      });

      const mesh = new THREE.Mesh(bufferGeometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshGroup.add(mesh);

      // Add wireframe overlay
      const wireframeGeometry = new THREE.EdgesGeometry(bufferGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        linewidth: 1,
        transparent: true,
        opacity: 0.3,
      });
      const wireframe = new THREE.LineSegments(
        wireframeGeometry,
        wireframeMaterial,
      );
      mesh.add(wireframe);

      // Optional: Visualize nodes as small spheres (for debugging)
      if (model.geometry.nodes.length < 1000) {
        // Only visualize if not too many nodes
        const nodeGeometry = new THREE.SphereGeometry(2, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6600,
          transparent: true,
          opacity: 0.2,
        });

        model.geometry.nodes.forEach((node) => {
          const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
          nodeMesh.position.set(node.x, node.y, node.z);
          nodeMesh.scale.set(0.5, 0.5, 0.5);
          meshGroup.add(nodeMesh);
        });
      }
    } else {
      // Fallback geometry
      console.log("[ModelViewer] Using fallback geometry");
      const geometry = createFallbackGeometry(model);
      const material = new THREE.MeshPhongMaterial({
        color: 0x4a9eff,
        emissive: 0x1a5a8a,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshGroup.add(mesh);

      // Wireframe
      const wireframeGeometry = new THREE.EdgesGeometry(geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
      });
      const wireframe = new THREE.LineSegments(
        wireframeGeometry,
        wireframeMaterial,
      );
      mesh.add(wireframe);
    }

    // ============================================
    // Auto-Center and Position Camera
    // ============================================

    const bbox = new THREE.Box3().setFromObject(meshGroup);
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());

    console.log("[ModelViewer] Bounding box size:", size);

    // Center geometry
    meshGroup.position.sub(center);

    // Position camera
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180); // Convert to radians
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5; // Add padding

    camera.position.set(cameraZ * 0.7, cameraZ * 0.5, cameraZ);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Update grid and axis helper sizes and positions based on model
    gridHelper.scale.set(maxDim / 500, maxDim / 500, maxDim / 500);
    gridHelper.position.y = -maxDim * 0.75;

    axisHelper.scale.set(maxDim / 150, maxDim / 150, maxDim / 150);
    axisHelper.position.set(-maxDim / 2, -maxDim / 2.5, maxDim / 2);

    // ============================================
    // Orbit Controls
    // ============================================

    // Create simple orbit-like controls without external dependency
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Rotate around Y axis
      const rotationSpeed = 0.005;
      const quat = new THREE.Quaternion();
      quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
      meshGroup.quaternion.multiplyQuaternions(quat, meshGroup.quaternion);

      // Rotate around X axis
      const euler = new THREE.Euler(0, 0, 0, "YXZ");
      euler.setFromQuaternion(meshGroup.quaternion);
      euler.rotateX(deltaY * rotationSpeed);
      meshGroup.quaternion.setFromEuler(euler);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Zoom with mouse wheel
    const onMouseWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 1.1;
      const direction = camera.position.clone().normalize();
      const currentDistance = camera.position.length();
      const newDistance =
        e.deltaY > 0
          ? currentDistance * zoomSpeed
          : currentDistance / zoomSpeed;
      camera.position.copy(direction.multiplyScalar(newDistance));
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onMouseWheel, {
      passive: false,
    });

    // ============================================
    // Animation Loop
    // ============================================

    let autoRotate = true; // Auto-rotate when idle

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Subtle auto-rotation
      if (autoRotate && !isDragging) {
        meshGroup.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ============================================
    // Handle Resize
    // ============================================

    const handleResize = () => {
      if (!containerRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      console.log("[ModelViewer] Resized to", newWidth, "x", newHeight);
    };

    window.addEventListener("resize", handleResize);

    // ============================================
    // Cleanup
    // ============================================

    return () => {
      console.log("[ModelViewer] Cleaning up resources");

      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onMouseWheel);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Dispose geometry and materials
      meshGroup.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [model]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.5)",
          color: "#4a9eff",
          padding: "8px 12px",
          borderRadius: "4px",
          fontSize: "0.85rem",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        🖱️ Drag to rotate | Scroll to zoom
      </div>
    </div>
  );
}

/**
 * Convert backend geometry data to Three.js BufferGeometry
 * Handles triangles, quads, and polygons
 */
function createGeometryFromData(geometryData) {
  const { nodes, faces } = geometryData;

  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  // Convert faces to triangulated mesh
  faces.forEach((face) => {
    const faceVertices = face.vertices;

    if (faceVertices.length === 3) {
      // Triangle - add directly
      faceVertices.forEach((idx) => {
        const node = nodes[idx];
        vertices.push(node.x, node.y, node.z);
      });
    } else if (faceVertices.length === 4) {
      // Quad - triangulate into 2 triangles
      const v0 = nodes[faceVertices[0]];
      const v1 = nodes[faceVertices[1]];
      const v2 = nodes[faceVertices[2]];
      const v3 = nodes[faceVertices[3]];

      // Triangle 1: 0,1,2
      vertices.push(v0.x, v0.y, v0.z);
      vertices.push(v1.x, v1.y, v1.z);
      vertices.push(v2.x, v2.y, v2.z);

      // Triangle 2: 0,2,3
      vertices.push(v0.x, v0.y, v0.z);
      vertices.push(v2.x, v2.y, v2.z);
      vertices.push(v3.x, v3.y, v3.z);
    } else if (faceVertices.length > 4) {
      // Polygon - fan triangulation from first vertex
      const v0 = nodes[faceVertices[0]];
      for (let i = 1; i < faceVertices.length - 1; i++) {
        const v1 = nodes[faceVertices[i]];
        const v2 = nodes[faceVertices[i + 1]];

        vertices.push(v0.x, v0.y, v0.z);
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
      }
    }
  });

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Create fallback geometry if backend doesn't provide geometry data
 */
function createFallbackGeometry(model) {
  switch (model.modelType) {
    case "gear":
      return createGearGeometry(model.dimensions.width / 2);
    case "bearing":
      return new THREE.TorusGeometry(
        model.dimensions.width / 4,
        model.dimensions.height / 10,
        16,
        100,
      );
    case "bracket":
      return new THREE.BoxGeometry(
        model.dimensions.width / 2,
        model.dimensions.height / 2,
        model.dimensions.depth / 2,
      );
    case "shaft":
      return new THREE.CylinderGeometry(
        model.dimensions.height / 10,
        model.dimensions.height / 10,
        model.dimensions.width / 2,
        32,
      );
    default:
      return new THREE.BoxGeometry(
        model.dimensions.width / 2,
        model.dimensions.height / 2,
        model.dimensions.depth / 2,
      );
  }
}

/**
 * Create simple gear geometry
 */
function createGearGeometry(radius) {
  const teeth = 12;
  const toothDepth = 10;

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  // Create gear profile
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i / (teeth * 2)) * Math.PI * 2;
    const isToothTip = i % 2 === 0;
    const r = isToothTip ? radius + toothDepth : radius;

    vertices.push(r * Math.cos(angle), r * Math.sin(angle), 0);
  }

  // Create triangles
  for (let i = 0; i < teeth * 2; i++) {
    const next = (i + 1) % (teeth * 2);
    indices.push(i, next, teeth * 2);
  }

  vertices.push(0, 0, 0); // Center point

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}
