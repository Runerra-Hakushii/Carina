import type { Constellation } from "./types";

// Horologium - The Pendulum Clock
export const horologium: Constellation = {
    name: "Horologium",
    description: "The Pendulum Clock, keeping time in the southern sky",
    link: "https://github.com/StarOmniscient/Horologium",
    stars: [
        { ra: 4.23, dec: -42.3, magnitude: 3.85, name: "Alpha Horologii" },
        { ra: 2.85, dec: -51.07, magnitude: 4.98, name: "R Horologii" }, // Variable star
        { ra: 2.98, dec: -64.08, magnitude: 4.98, name: "Beta Horologii" },
        { ra: 3.58, dec: -57.84, magnitude: 5.29, name: "Delta Horologii" },
        { ra: 2.73, dec: -54.56, magnitude: 5.26, name: "Iota Horologii" },
        { ra: 3.27, dec: -45.98, magnitude: 5.3, name: "Zeta Horologii" },
    ],
    connections: [
        [0, 5], // Alpha -> Zeta
        [5, 1], // Zeta -> R
        [1, 4], // R -> Iota
        [4, 3], // Iota -> Delta
        [3, 2], // Delta -> Beta
    ],
};
