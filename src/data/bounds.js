// Country bounds for Australia and New Zealand
const countryBounds = {
  au: [112.669086, -43.696673, 153.726368, -10.737187], // Australia
  nz: [166.332922, -47.292562, 178.573837, -34.394162], // New Zealand
};

// Combine country bounds to get total bounds
export const totalBounds = Object.values(countryBounds).reduce(
  (
    [prevWest, prevSouth, prevEast, prevNorth],
    [currWest, currSouth, currEast, currNorth]
  ) => [
    Math.min(prevWest, currWest), // West boundary
    Math.min(prevSouth, currSouth), // South boundary
    Math.max(prevEast, currEast), // East boundary
    Math.max(prevNorth, currNorth), // North boundary
  ],
  [Infinity, Infinity, -Infinity, -Infinity] // Initial accumulator value
);
