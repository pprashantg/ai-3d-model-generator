export const validateDimensions = (dimensions) => {
  const { width, height, depth } = dimensions;
  return width > 0 && height > 0 && depth > 0;
};

export const formatModelData = (raw) => {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
  };
};
