"use client";

import { StarMap } from "@/components/ui/star-map";
import { useEffect, useState } from "react";

export default function Home() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    if (dimensions.width === 0) return null;

    return (
        <div className="w-screen h-screen overflow-hidden">
            <StarMap width={dimensions.width} height={dimensions.height} />
        </div>
    );
}