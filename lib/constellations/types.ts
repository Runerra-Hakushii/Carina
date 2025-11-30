export interface Star {
    ra: number; // Right Ascension in hours
    dec: number; // Declination in degrees
    magnitude: number; // Brightness
    name?: string;
}

export interface Constellation {
    name: string;
    stars: Star[];
    connections: number[][]; // Pairs of star indices to connect
    links: {
        github: string;
        site?: string;
    }; // URLs to redirect on click
    icon?: string;
    description: string;
}
