export default class GeometryUtils {
  /**
   * Calculate volume of a geometry
   * @param {Object} geometry - Geometry object
   * @returns {number} Volume in cubic units
   */
  static calculateVolume(geometry) {
    switch (geometry.type) {
      case "box":
        return geometry.width * geometry.height * geometry.depth;

      case "cylinder":
        return Math.PI * geometry.radius ** 2 * geometry.height;

      case "sphere":
        return (4 / 3) * Math.PI * geometry.radius ** 3;

      case "gear":
        return this.calculateGearVolume(geometry);

      case "bearing":
        return this.calculateBearingVolume(geometry);

      default:
        return 0;
    }
  }

  /**
   * Calculate surface area
   * @param {Object} geometry - Geometry object
   * @returns {number} Surface area in square units
   */
  static calculateSurfaceArea(geometry) {
    switch (geometry.type) {
      case "box":
        const { width, height, depth } = geometry;
        return 2 * (width * height + height * depth + depth * width);

      case "cylinder":
        return (
          2 * Math.PI * geometry.radius * geometry.height +
          2 * Math.PI * geometry.radius ** 2
        );

      case "sphere":
        return 4 * Math.PI * geometry.radius ** 2;

      default:
        return 0;
    }
  }

  /**
   * Calculate mass based on material and volume
   * @param {Object} geometry - Geometry object
   * @param {string} material - Material type
   * @returns {number} Mass in grams
   */
  static calculateMass(geometry, material) {
    const volume = this.calculateVolume(geometry);
    const densities = {
      steel: 7.85,
      aluminum: 2.7,
      titanium: 4.54,
      plastic: 1.2,
      composite: 1.6,
    };

    const density = densities[material] || 1.0;
    return volume * density;
  }

  /**
   * Optimize geometry for 3D printing
   * @param {Object} geometry - Geometry object
   * @returns {Object} Optimized geometry
   */
  static optimizeForPrinting(geometry) {
    return {
      ...geometry,
      optimized: true,
      supportStructures: this.calculateSupportStructures(geometry),
    };
  }

  /**
   * Calculate support structures needed for 3D printing
   * @param {Object} geometry - Geometry object
   * @returns {Array} Support structure points
   */
  static calculateSupportStructures(geometry) {
    // Simplified support structure calculation
    return [
      { x: 0, y: 0, z: -5 },
      { x: 10, y: 10, z: -5 },
      { x: -10, y: 10, z: -5 },
    ];
  }

  /**
   * Validate geometry integrity
   * @param {Object} geometry - Geometry object
   * @returns {Object} Validation result
   */
  static validateGeometry(geometry) {
    const issues = [];

    if (geometry.type === "box") {
      if (geometry.width <= 0 || geometry.height <= 0 || geometry.depth <= 0) {
        issues.push("Invalid box dimensions");
      }
    }

    if (geometry.type === "cylinder") {
      if (geometry.radius <= 0 || geometry.height <= 0) {
        issues.push("Invalid cylinder dimensions");
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }

  static calculateGearVolume(geometry) {
    // Approximate gear volume
    return (
      Math.PI * geometry.radius ** 2 * 10 * (1 + (0.2 * geometry.teeth) / 20)
    );
  }

  static calculateBearingVolume(geometry) {
    // Approximate bearing volume
    const ringVolume =
      Math.PI * (geometry.outerRadius ** 2 - geometry.innerRadius ** 2) * 5;
    const ballVolume =
      geometry.ballCount * (4 / 3) * Math.PI * geometry.ballRadius ** 3;
    return ringVolume + ballVolume;
  }
}
