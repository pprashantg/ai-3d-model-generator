import { v4 as uuidv4 } from "uuid";

// In-memory model storage (replace with database in production)
const models = new Map();

export async function generateModel(formData) {
  const modelId = uuidv4();

  // Generate 3D geometry based on model type
  const geometry = generateGeometry(formData);

  const model = {
    id: modelId,
    ...formData,
    geometry,
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  models.set(modelId, model);
  return model;
}

/**
 * Generate 3D geometry for engineering structures
 * @param {Object} formData - Model specification
 * @returns {Object} Geometry with nodes, edges, and faces
 */
function generateGeometry(formData) {
  const { modelType, dimensions, complexity = "medium" } = formData;

  switch (modelType) {
    case "gear":
      return generateGearGeometry(dimensions, complexity);
    case "bearing":
      return generateBearingGeometry(dimensions, complexity);
    case "bracket":
      return generateBracketGeometry(dimensions, complexity);
    case "shaft":
      return generateShaftGeometry(dimensions, complexity);
    default:
      return generateBracketGeometry(dimensions, complexity);
  }
}

/**
 * Generate parametric gear geometry
 * @param {Object} dimensions - {width, height, depth}
 * @param {string} complexity - simple, medium, complex, advanced
 * @returns {Object} Geometry data
 */
function generateGearGeometry(dimensions, complexity) {
  const teeth =
    complexity === "simple"
      ? 12
      : complexity === "medium"
        ? 20
        : complexity === "complex"
          ? 28
          : 32;

  const outerRadius = dimensions.width / 2;
  const innerRadius = outerRadius * 0.6;
  const toothDepth = dimensions.height / 4;
  const thickness = dimensions.depth / 2;

  const nodes = [];
  const edges = [];
  const faces = [];

  const addNode = (x, y, z) => {
    const index = nodes.length;
    nodes.push({ x, y, z });
    return index;
  };

  // Generate gear profile vertices (front and back faces)
  const frontVertices = [];
  const backVertices = [];
  const pointsPerTooth = 4; // 4 points per tooth for more realistic shape

  for (let i = 0; i < teeth * pointsPerTooth; i++) {
    const angle = (i / (teeth * pointsPerTooth)) * Math.PI * 2;
    const toothPhase = i % pointsPerTooth;

    // Create tooth profile: base -> tip -> tip -> base
    let r;
    if (toothPhase === 0 || toothPhase === 3) {
      r = outerRadius; // Tooth base
    } else {
      r = outerRadius + toothDepth; // Tooth tip
    }

    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);

    // Front face
    const frontIdx = addNode(x, y, thickness / 2);
    frontVertices.push(frontIdx);

    // Back face
    const backIdx = addNode(x, y, -thickness / 2);
    backVertices.push(backIdx);
  }

  // Add center nodes for hub
  const centerFront = addNode(0, 0, thickness / 2);
  const centerBack = addNode(0, 0, -thickness / 2);

  // Create inner hub circle
  const hubVerticesFront = [];
  const hubVerticesBack = [];
  const hubSegments = 16;

  for (let i = 0; i < hubSegments; i++) {
    const angle = (i / hubSegments) * Math.PI * 2;
    const x = innerRadius * Math.cos(angle);
    const y = innerRadius * Math.sin(angle);

    hubVerticesFront.push(addNode(x, y, thickness / 2));
    hubVerticesBack.push(addNode(x, y, -thickness / 2));
  }

  // Generate edges
  // Outer perimeter edges (front face)
  for (let i = 0; i < frontVertices.length; i++) {
    const next = (i + 1) % frontVertices.length;
    edges.push({ start: frontVertices[i], end: frontVertices[next] });
  }

  // Outer perimeter edges (back face)
  for (let i = 0; i < backVertices.length; i++) {
    const next = (i + 1) % backVertices.length;
    edges.push({ start: backVertices[i], end: backVertices[next] });
  }

  // Connect front to back (side edges)
  for (let i = 0; i < frontVertices.length; i++) {
    edges.push({ start: frontVertices[i], end: backVertices[i] });
  }

  // Hub edges
  for (let i = 0; i < hubSegments; i++) {
    const next = (i + 1) % hubSegments;
    edges.push({ start: hubVerticesFront[i], end: hubVerticesFront[next] });
    edges.push({ start: hubVerticesBack[i], end: hubVerticesBack[next] });
    edges.push({ start: hubVerticesFront[i], end: hubVerticesBack[i] });
  }

  // Generate faces
  // Front face triangles
  for (let i = 0; i < frontVertices.length; i++) {
    const next = (i + 1) % frontVertices.length;
    faces.push({
      vertices: [centerFront, frontVertices[i], frontVertices[next]],
    });
  }

  // Back face triangles
  for (let i = 0; i < backVertices.length; i++) {
    const next = (i + 1) % backVertices.length;
    faces.push({ vertices: [centerBack, backVertices[next], backVertices[i]] });
  }

  // Side faces (connecting front and back)
  for (let i = 0; i < frontVertices.length; i++) {
    const next = (i + 1) % frontVertices.length;
    faces.push({
      vertices: [
        frontVertices[i],
        backVertices[i],
        backVertices[next],
        frontVertices[next],
      ],
    });
  }

  // Hub faces
  for (let i = 0; i < hubSegments; i++) {
    const next = (i + 1) % hubSegments;
    faces.push({
      vertices: [
        hubVerticesFront[i],
        hubVerticesBack[i],
        hubVerticesBack[next],
        hubVerticesFront[next],
      ],
    });
  }

  return {
    type: "gear",
    nodes,
    edges,
    faces,
    metadata: {
      teeth,
      outerRadius,
      innerRadius,
      toothDepth,
      thickness,
    },
  };
}

/**
 * Generate bearing geometry
 */
function generateBearingGeometry(dimensions, complexity) {
  const outerRadius = dimensions.width / 2;
  const innerRadius = dimensions.width / 4;
  const thickness = dimensions.depth / 2;
  const ballCount =
    complexity === "simple" ? 8 : complexity === "medium" ? 12 : 16;
  const ballRadius = (outerRadius - innerRadius) / 4;
  const ballOrbitRadius = (outerRadius + innerRadius) / 2;

  const nodes = [];
  const edges = [];
  const faces = [];
  const segments = 32;

  const addNode = (x, y, z) => {
    const index = nodes.length;
    nodes.push({ x, y, z });
    return index;
  };

  // Outer ring
  const outerRingTop = [];
  const outerRingBottom = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = outerRadius * Math.cos(angle);
    const y = outerRadius * Math.sin(angle);
    outerRingTop.push(addNode(x, y, thickness / 2));
    outerRingBottom.push(addNode(x, y, -thickness / 2));
  }

  // Inner ring
  const innerRingTop = [];
  const innerRingBottom = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = innerRadius * Math.cos(angle);
    const y = innerRadius * Math.sin(angle);
    innerRingTop.push(addNode(x, y, thickness / 2));
    innerRingBottom.push(addNode(x, y, -thickness / 2));
  }

  // Ball bearings (simplified as octahedrons)
  const ballSegments = 8;
  for (let b = 0; b < ballCount; b++) {
    const ballAngle = (b / ballCount) * Math.PI * 2;
    const ballCenterX = ballOrbitRadius * Math.cos(ballAngle);
    const ballCenterY = ballOrbitRadius * Math.sin(ballAngle);

    const ballVertices = [];
    for (let i = 0; i < ballSegments; i++) {
      const angle = (i / ballSegments) * Math.PI * 2;
      const x = ballCenterX + ballRadius * Math.cos(angle);
      const y = ballCenterY + ballRadius * Math.sin(angle);
      ballVertices.push(addNode(x, y, 0));
    }

    // Ball edges
    for (let i = 0; i < ballSegments; i++) {
      const next = (i + 1) % ballSegments;
      edges.push({ start: ballVertices[i], end: ballVertices[next] });
    }
  }

  // Edges for rings
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    edges.push({ start: outerRingTop[i], end: outerRingTop[next] });
    edges.push({ start: outerRingBottom[i], end: outerRingBottom[next] });
    edges.push({ start: outerRingTop[i], end: outerRingBottom[i] });

    edges.push({ start: innerRingTop[i], end: innerRingTop[next] });
    edges.push({ start: innerRingBottom[i], end: innerRingBottom[next] });
    edges.push({ start: innerRingTop[i], end: innerRingBottom[i] });
  }

  // Faces for outer ring
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      vertices: [
        outerRingTop[i],
        outerRingBottom[i],
        outerRingBottom[next],
        outerRingTop[next],
      ],
    });
  }

  // Faces for inner ring
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      vertices: [
        innerRingTop[i],
        innerRingTop[next],
        innerRingBottom[next],
        innerRingBottom[i],
      ],
    });
  }

  return {
    type: "bearing",
    nodes,
    edges,
    faces,
    metadata: {
      outerRadius,
      innerRadius,
      ballCount,
      ballRadius,
      thickness,
    },
  };
}

/**
 * Generate bracket geometry
 */
function generateBracketGeometry(dimensions, complexity) {
  const width = dimensions.width / 2;
  const height = dimensions.height / 2;
  const depth = dimensions.depth / 2;

  const nodes = [];
  const edges = [];
  const faces = [];

  const addNode = (x, y, z) => {
    const index = nodes.length;
    nodes.push({ x, y, z });
    return index;
  };

  // Base box vertices
  const v0 = addNode(-width, -height, -depth);
  const v1 = addNode(width, -height, -depth);
  const v2 = addNode(width, height, -depth);
  const v3 = addNode(-width, height, -depth);
  const v4 = addNode(-width, -height, depth);
  const v5 = addNode(width, -height, depth);
  const v6 = addNode(width, height, depth);
  const v7 = addNode(-width, height, depth);

  // Edges
  const boxEdges = [
    [v0, v1],
    [v1, v2],
    [v2, v3],
    [v3, v0],
    [v4, v5],
    [v5, v6],
    [v6, v7],
    [v7, v4],
    [v0, v4],
    [v1, v5],
    [v2, v6],
    [v3, v7],
  ];
  boxEdges.forEach(([start, end]) => edges.push({ start, end }));

  // Faces
  faces.push({ vertices: [v0, v1, v2, v3] }); // Front
  faces.push({ vertices: [v4, v7, v6, v5] }); // Back
  faces.push({ vertices: [v0, v4, v5, v1] }); // Bottom
  faces.push({ vertices: [v2, v6, v7, v3] }); // Top
  faces.push({ vertices: [v0, v3, v7, v4] }); // Left
  faces.push({ vertices: [v1, v5, v6, v2] }); // Right

  // Add mounting holes for complex brackets
  if (
    complexity === "medium" ||
    complexity === "complex" ||
    complexity === "advanced"
  ) {
    const holeRadius = width * 0.15;
    const holeSegments = 12;
    const holeOffsetX = width * 0.6;
    const holeOffsetY = height * 0.6;

    const holes = [
      { x: holeOffsetX, y: holeOffsetY },
      { x: -holeOffsetX, y: holeOffsetY },
      { x: holeOffsetX, y: -holeOffsetY },
      { x: -holeOffsetX, y: -holeOffsetY },
    ];

    holes.forEach((hole) => {
      const holeVerticesFront = [];
      const holeVerticesBack = [];

      for (let i = 0; i < holeSegments; i++) {
        const angle = (i / holeSegments) * Math.PI * 2;
        const x = hole.x + holeRadius * Math.cos(angle);
        const y = hole.y + holeRadius * Math.sin(angle);

        holeVerticesFront.push(addNode(x, y, -depth));
        holeVerticesBack.push(addNode(x, y, depth));
      }

      // Hole edges
      for (let i = 0; i < holeSegments; i++) {
        const next = (i + 1) % holeSegments;
        edges.push({
          start: holeVerticesFront[i],
          end: holeVerticesFront[next],
        });
        edges.push({ start: holeVerticesBack[i], end: holeVerticesBack[next] });
        edges.push({ start: holeVerticesFront[i], end: holeVerticesBack[i] });
      }
    });
  }

  return {
    type: "bracket",
    nodes,
    edges,
    faces,
    metadata: {
      width: width * 2,
      height: height * 2,
      depth: depth * 2,
    },
  };
}

/**
 * Generate shaft geometry
 */
function generateShaftGeometry(dimensions, complexity) {
  const radius = dimensions.height / 10;
  const length = dimensions.width / 2;
  const segments =
    complexity === "simple" ? 12 : complexity === "medium" ? 24 : 32;

  const nodes = [];
  const edges = [];
  const faces = [];

  const addNode = (x, y, z) => {
    const index = nodes.length;
    nodes.push({ x, y, z });
    return index;
  };

  // Bottom circle
  const bottomCircle = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    bottomCircle.push(addNode(x, -length, z));
  }

  // Top circle
  const topCircle = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    topCircle.push(addNode(x, length, z));
  }

  // Center points for caps
  const bottomCenter = addNode(0, -length, 0);
  const topCenter = addNode(0, length, 0);

  // Edges
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    edges.push({ start: bottomCircle[i], end: bottomCircle[next] });
    edges.push({ start: topCircle[i], end: topCircle[next] });
    edges.push({ start: bottomCircle[i], end: topCircle[i] });
  }

  // Faces
  // Bottom cap
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      vertices: [bottomCenter, bottomCircle[next], bottomCircle[i]],
    });
  }

  // Top cap
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({ vertices: [topCenter, topCircle[i], topCircle[next]] });
  }

  // Side faces
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push({
      vertices: [
        bottomCircle[i],
        bottomCircle[next],
        topCircle[next],
        topCircle[i],
      ],
    });
  }

  return {
    type: "shaft",
    nodes,
    edges,
    faces,
    metadata: {
      radius,
      length: length * 2,
      segments,
    },
  };
}

export async function getModel(id) {
  return models.get(id) || null;
}

export async function listModels() {
  return Array.from(models.values());
}

export async function exportModel(id, format) {
  const model = models.get(id);
  if (!model) {
    throw new Error("Model not found");
  }

  // In a real application, this would convert the model to the requested format
  // For now, return mock data
  const mockData = JSON.stringify({
    model,
    format,
    exportedAt: new Date().toISOString(),
  });

  return Buffer.from(mockData);
}
