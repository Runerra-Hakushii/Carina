import type { Constellation } from "./types";

// Astraeus - The Titan of Dusk and Winds (Custom Constellation)
export const astraeus: Constellation = {
    name: "Astraeus",
    description: "Titan god of the dusk, stars, and planets, and the art of astrology",
    link: "https://github.com/StarOmniscient/Astraeus",
    stars: [
        // Custom pattern resembling a star or wind rose
        { ra: 28.0, dec: 15.0, magnitude: 2.5, name: "Astraeus Prime" }, // Center
        { ra: 28.0, dec: 25.0, magnitude: 3.5, name: "Boreas (North Wind)" },
        { ra: 28.0, dec: 5.0, magnitude: 3.5, name: "Notus (South Wind)" },
        { ra: 29.0, dec: 15.0, magnitude: 3.5, name: "Eurus (East Wind)" },
        { ra: 27.0, dec: 15.0, magnitude: 3.5, name: "Zephyrus (West Wind)" },
        { ra: 28.7, dec: 22.0, magnitude: 4.5, name: "Eosphorus (Dawn)" },
        { ra: 27.3, dec: 8.0, magnitude: 4.5, name: "Hesperus (Dusk)" },
    ],
    connections: [
        [0, 1], // Center -> North
        [0, 2], // Center -> South
        [0, 3], // Center -> East
        [0, 4], // Center -> West
        [1, 5], // North -> Dawn
        [2, 6], // South -> Dusk
        [3, 5], // East -> Dawn
        [4, 6], // West -> Dusk
    ],
};
