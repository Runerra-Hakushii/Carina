import type { Constellation } from "./types";

// Lyra - The Harp, contains Vega
export const lyra: Constellation = {
    name: "Lyra",
    description: "The celestial harp, home to brilliant Vega",
    link: "https://github.com/StarOmniscient/Lyra",
    stars: [
        { ra: 14.62, dec: 38.78, magnitude: 0.03, name: "Vega (Alpha Lyrae)" },
        { ra: 14.73, dec: 39.66, magnitude: 4.78, name: "Epsilon Lyrae" },
        { ra: 14.74, dec: 37.6, magnitude: 4.34, name: "Zeta Lyrae" },
        { ra: 14.9, dec: 36.9, magnitude: 4.3, name: "Delta Lyrae" },
        { ra: 14.98, dec: 32.69, magnitude: 3.25, name: "Sulafat (Gamma Lyrae)" },
        { ra: 14.83, dec: 33.36, magnitude: 3.52, name: "Sheliak (Beta Lyrae)" },
    ],
    connections: [
        [0, 2], // Vega -> Zeta
        [0, 1], // Vega -> Epsilon
        [1, 2], // Epsilon -> Zeta
        [2, 3], // Zeta -> Delta
        [3, 4], // Delta -> Gamma
        [4, 5], // Gamma -> Beta
        [5, 2], // Beta -> Zeta
    ],
};
