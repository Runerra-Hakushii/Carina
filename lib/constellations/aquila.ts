import type { Constellation } from "./types";

// Aquila - The Eagle, contains Altair
export const aquila: Constellation = {
    name: "Aquila",
    description: "The soaring eagle, home to brilliant Altair",
    link: "https://github.com/StarOmniscient/Aquila-archive",
    stars: [
        { ra: 17.85, dec: 8.87, magnitude: 0.76, name: "Altair (Alpha Aquilae)" },
        { ra: 17.92, dec: 6.41, magnitude: 3.71, name: "Alshain (Beta Aquilae)" },
        { ra: 17.77, dec: 10.61, magnitude: 2.72, name: "Tarazed (Gamma Aquilae)" },
        { ra: 17.42, dec: 3.11, magnitude: 3.36, name: "Delta Aquilae" },
        { ra: 17.08, dec: 13.86, magnitude: 2.99, name: "Zeta Aquilae" },
        { ra: 16.99, dec: 15.07, magnitude: 4.02, name: "Epsilon Aquilae" },
        { ra: 17.87, dec: 1.0, magnitude: 3.87, name: "Eta Aquilae (Bezek)" },
        { ra: 18.19, dec: -0.82, magnitude: 3.24, name: "Theta Aquilae (Tseen Foo)" },
        { ra: 17.1, dec: -4.87, magnitude: 3.43, name: "Lambda Aquilae" },
        { ra: 16.98, dec: -5.74, magnitude: 4.02, name: "12 Aquilae" },
    ],
    connections: [
        [0, 1], // Altair -> Beta
        [0, 2], // Altair -> Gamma
        [0, 3], // Altair -> Delta
        [3, 4], // Delta -> Zeta
        [4, 5], // Zeta -> Epsilon
        [3, 6], // Delta -> Eta
        [6, 7], // Eta -> Theta
        [3, 8], // Delta -> Lambda
        [8, 9], // Lambda -> 12
    ],
};
