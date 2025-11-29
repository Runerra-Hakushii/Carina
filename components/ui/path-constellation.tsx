"use client";

import { useEffect, useRef, useState } from "react";

interface PathConstellationProps {
    pathData: string;
    starCount?: number;
    starSize?: number;
    starColor?: string;
    glowEffect?: boolean;
    pulseEffect?: boolean;
    className?: string;
    viewBox?: string;
}

interface StarPoint {
    x: number;
    y: number;
    delay: number;
}

export function PathConstellation({
    pathData,
    starCount = 50,
    starSize = 2,
    starColor = "#ffffff",
    glowEffect = true,
    pulseEffect = true,
    className = "",
    viewBox = "0 0 300 300",
}: PathConstellationProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [stars, setStars] = useState<StarPoint[]>([]);

    useEffect(() => {
        if (!svgRef.current) return;

        // Create a temporary path element to calculate points
        const tempPath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
        );
        tempPath.setAttribute("d", pathData);
        svgRef.current.appendChild(tempPath);

        const pathLength = tempPath.getTotalLength();
        const points: StarPoint[] = [];

        // Calculate evenly spaced points along the path
        for (let i = 0; i < starCount; i++) {
            const distance = (pathLength / starCount) * i;
            const point = tempPath.getPointAtLength(distance);
            points.push({
                x: point.x,
                y: point.y,
                delay: Math.random() * 3, // Random delay for pulse animation
            });
        }

        setStars(points);
        svgRef.current.removeChild(tempPath);
    }, [pathData, starCount]);

    return (
        <svg
            ref={svgRef}
            viewBox={viewBox}
            className={`w-full h-full ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {glowEffect && (
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                )}
            </defs>

            {/* Render the original path as a subtle outline (optional) */}
            <path
                d={pathData}
                fill="none"
                stroke={starColor}
                strokeWidth="0.5"
                opacity="0.2"
            />

            {/* Render stars at calculated points */}
            {stars.map((star, index) => (
                <g key={index}>
                    {/* Star glow */}
                    {glowEffect && (
                        <circle
                            cx={star.x}
                            cy={star.y}
                            r={starSize * 2}
                            fill={starColor}
                            opacity="0.3"
                            filter="url(#glow)"
                            className={pulseEffect ? "animate-pulse-slow" : ""}
                            style={
                                pulseEffect
                                    ? {
                                        animationDelay: `${star.delay}s`,
                                    }
                                    : undefined
                            }
                        />
                    )}
                    {/* Star core */}
                    <circle
                        cx={star.x}
                        cy={star.y}
                        r={starSize}
                        fill={starColor}
                        className={pulseEffect ? "animate-pulse-slow" : ""}
                        style={
                            pulseEffect
                                ? {
                                    animationDelay: `${star.delay}s`,
                                }
                                : undefined
                        }
                    />
                    {/* Star sparkle (cross shape) */}
                    <g opacity="0.8">
                        <line
                            x1={star.x}
                            y1={star.y - starSize * 1.5}
                            x2={star.x}
                            y2={star.y + starSize * 1.5}
                            stroke={starColor}
                            strokeWidth="0.5"
                            className={pulseEffect ? "animate-pulse-slow" : ""}
                            style={
                                pulseEffect
                                    ? {
                                        animationDelay: `${star.delay}s`,
                                    }
                                    : undefined
                            }
                        />
                        <line
                            x1={star.x - starSize * 1.5}
                            y1={star.y}
                            x2={star.x + starSize * 1.5}
                            y2={star.y}
                            stroke={starColor}
                            strokeWidth="0.5"
                            className={pulseEffect ? "animate-pulse-slow" : ""}
                            style={
                                pulseEffect
                                    ? {
                                        animationDelay: `${star.delay}s`,
                                    }
                                    : undefined
                            }
                        />
                    </g>
                </g>
            ))}
        </svg>
    );
}
