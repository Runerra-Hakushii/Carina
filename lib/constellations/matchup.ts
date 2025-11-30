import type { Constellation } from "./types";

// MatchUP - Tournament Manager
export const matchup: Constellation = {
    name: "MatchUP",
    description: "Tournament Manager - Organize and manage tournaments with ease.",
    links: {
        github: "https://github.com/StarOmniscient/TournamentManager",
        site: "https://matchup.runerra.org",
    },
    stars: [
        { ra: 14.84, dec: -16.04, magnitude: 2.75, name: "Zubenelgenubi (Alpha Librae)" },
        { ra: 15.28, dec: -9.38, magnitude: 2.61, name: "Zubeneschamali (Beta Librae)" },
        { ra: 15.58, dec: -14.8, magnitude: 3.91, name: "Zubenelakrab (Gamma Librae)" }, // Gamma is actually Zubenelakrab? Checking star charts... Gamma Librae is Zubenelakrab.
        // Let's stick to a recognizable shape.
        // Alpha (Zubenelgenubi)
        // Beta (Zubeneschamali)
        // Gamma (Zubenelakrab)
        // Sigma (Brachium)
        { ra: 15.01, dec: -25.28, magnitude: 3.29, name: "Brachium (Sigma Librae)" },
        { ra: 15.62, dec: -28.14, magnitude: 3.6, name: "Upsilon Librae" },
        { ra: 15.64, dec: -29.78, magnitude: 5.1, name: "Tau Librae" },
    ],
    connections: [
        [0, 1], // Alpha -> Beta
        [0, 3], // Alpha -> Sigma
        [1, 2], // Beta -> Gamma
        [2, 3], // Gamma -> Sigma (Closing the top triangle/box part) - actually Libra is usually depicted as a scale.
        // Let's try a standard stick figure for Libra.
        // Alpha -> Beta (Beam)
        // Alpha -> Sigma (Pan 1 support)
        // Beta -> Gamma (Pan 2 support)
        // But Gamma is "below" Beta in Dec?
        // Beta: -9, Gamma: -14. Yes.
        // Alpha: -16, Sigma: -25.
        // So:
        // Beta (top right) -> Alpha (top left)
        // Beta -> Gamma (bottom right)
        // Alpha -> Sigma (bottom left)
        // Let's add Upsilon and Tau for the bottom of the Sigma pan? Or just keep it simple.
        // Let's connect Sigma -> Upsilon -> Tau for a "pan" shape?
        [3, 4], // Sigma -> Upsilon
        [4, 5], // Upsilon -> Tau
    ],
};
