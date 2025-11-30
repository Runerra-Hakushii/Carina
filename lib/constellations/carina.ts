import type { Constellation } from "./types";

// Carina - The Keel (of the ship Argo Navis), contains Canopus
export const carina: Constellation = {
    name: "Carina",
    description: "The Keel, home to Canopus, second brightest star",
    links: {
        github: "https://github.com/StarOmniscient/Carina",
        site: "https://runerra.org"
    },
    icon: "/carina_logo.png",
    stars: [
        { ra: 10.4, dec: -52.7, magnitude: -0.74, name: "Canopus (Alpha Carinae)" },
        { ra: 12.38, dec: -59.51, magnitude: 1.86, name: "Avior (Epsilon Carinae)" },
        { ra: 13.28, dec: -59.27, magnitude: 2.21, name: "Aspidiske (Iota Carinae)" },
        { ra: 13.22, dec: -69.72, magnitude: 1.67, name: "Miaplacidus (Beta Carinae)" },
        { ra: 14.22, dec: -70.03, magnitude: 3.29, name: "Omega Carinae" },
        { ra: 14.72, dec: -64.39, magnitude: 2.74, name: "Theta Carinae" },
    ],
    connections: [
        [0, 1], // Canopus -> Avior
        [1, 2], // Avior -> Aspidiske
        [2, 4], // Aspidiske -> Omega
        [4, 3], // Omega -> Miaplacidus
        [3, 5], // Miaplacidus -> Theta
    ],
};
