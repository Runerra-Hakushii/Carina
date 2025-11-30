import type { Constellation } from "./types";

// Lynx - The faint northern constellation
export const lynx: Constellation = {
    name: "Lynx",
    description: "The elusive feline of the northern sky",
    links: {
        github: "https://github.com/StarOmniscient/Lynx",
        site: "https://lynx.runerra.org",
    },
    icon: "/lynx_logo.png",
    stars: [
        { ra: 6.15, dec: 59.0, magnitude: 5.25, name: "2 Lyncis" },
        { ra: 6.95, dec: 58.42, magnitude: 4.35, name: "15 Lyncis" },
        { ra: 7.43, dec: 49.2, magnitude: 4.61, name: "21 Lyncis" },
        { ra: 8.38, dec: 43.19, magnitude: 4.25, name: "31 Lyncis (Alsciaukat)" },
        { ra: 9.31, dec: 36.8, magnitude: 3.82, name: "38 Lyncis (Maculata)" },
        { ra: 9.01, dec: 41.78, magnitude: 3.96, name: "10 Ursae Majoris" },
        { ra: 9.35, dec: 34.39, magnitude: 3.13, name: "Alpha Lyncis" },
    ],
    connections: [
        [0, 1], // 2 -> 15
        [1, 2], // 15 -> 21
        [2, 3], // 21 -> 31
        [3, 4], // 31 -> 38
        [4, 6], // 38 -> Alpha
        [4, 5], // 38 -> 10 UMa (Spur)
    ],
};
