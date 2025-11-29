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
    link: string; // URL to redirect on click
    description: string;
}
