"use client";

import { useEffect, useRef, useState } from "react";
import { allConstellations } from "@/lib/constellations";
import type { Constellation } from "@/lib/constellations/types";
import { raDecToScreen, distance } from "@/lib/coordinates";

interface StarMapProps {
    width?: number;
    height?: number;
    className?: string;
}

export function StarMap({
    width = 1200,
    height = 600,
    className = "",
}: StarMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State declarations moved to top to fix scope issues
    const [offset, setOffset] = useState({ x: width / 2, y: height / 2 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredConstellation, setHoveredConstellation] =
        useState<Constellation | null>(null);
    const [showCompass, setShowCompass] = useState(false);
    const [zoom, setZoom] = useState(1); // Zoom level, default 1
    const BASE_SCALE = 30;

    const [nearestConstellation, setNearestConstellation] = useState<{
        name: string;
        angle: number;
        distance: number;
        screenPos: { x: number; y: number };
        isOnScreen: boolean;
    } | null>(null);

    // Generate random background stars - adjusted for aesthetic balance
    const backgroundStars = useRef(
        Array.from({ length: 25000 }, () => ({
            ra: Math.random() * 60 - 18,
            dec: Math.random() * 360 - 180,
            size: Math.random() > 0.98 ? Math.random() * 2 + 2 : Math.random() * 1.5 + 0.5, // Mostly small stars, few large ones
            opacity: Math.random() * 0.7 + 0.1, // More subtle opacity
            type: Math.random() > 0.9 ? "cross" : "circle", // Mostly circles, some crosses
        })),
    );

    // Helper to draw a star shape
    const drawStar = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        opacity: number,
        type: string = "circle",
    ) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

        if (type === "cross") {
            // Draw diamond/star shape
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.quadraticCurveTo(x + size * 0.1, y - size * 0.1, x + size, y);
            ctx.quadraticCurveTo(x + size * 0.1, y + size * 0.1, x, y + size);
            ctx.quadraticCurveTo(x - size * 0.1, y + size * 0.1, x - size, y);
            ctx.quadraticCurveTo(x - size * 0.1, y - size * 0.1, x, y - size);
            ctx.fill();
            // Add extra glow for cross stars
            if (size > 2) {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
                ctx.beginPath();
                ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Simple circle for most stars
            ctx.beginPath();
            ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    // Draw the star map
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas with dark blue background
        ctx.fillStyle = "#020205"; // Deep dark blue/black
        ctx.fillRect(0, 0, width, height);

        // Draw background stars
        backgroundStars.current.forEach((star) => {
            const currentScale = BASE_SCALE * zoom;
            const pos = raDecToScreen(star.ra, star.dec, offset.x, offset.y, currentScale);

            // Simple optimization: don't draw if far off screen
            if (pos.x < -50 || pos.x > width + 50 || pos.y < -50 || pos.y > height + 50) return;

            drawStar(ctx, pos.x, pos.y, star.size * zoom, star.opacity, star.type);
        });

        // Draw constellations
        allConstellations.forEach((constellation) => {
            const isHovered = hoveredConstellation?.name === constellation.name;
            const currentScale = BASE_SCALE * zoom;

            // Convert star positions to screen coordinates
            const screenStars = constellation.stars.map((star) =>
                raDecToScreen(star.ra, star.dec, offset.x, offset.y, currentScale),
            );

            // Draw constellation lines
            ctx.strokeStyle = isHovered
                ? "rgba(100, 150, 255, 0.6)"
                : "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = (isHovered ? 2 : 1) * zoom; // Scale line width
            constellation.connections.forEach(([start, end]) => {
                ctx.beginPath();
                ctx.moveTo(screenStars[start].x, screenStars[start].y);
                ctx.lineTo(screenStars[end].x, screenStars[end].y);
                ctx.stroke();
            });

            // Draw stars
            screenStars.forEach((pos, index) => {
                const star = constellation.stars[index];
                const starRadius = Math.max(4, 9 - star.magnitude) * zoom; // Scale star radius

                // Glow effect for hovered constellation
                if (isHovered) {
                    ctx.fillStyle = "rgba(100, 150, 255, 0.3)";
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, starRadius * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw main star using custom shape
                drawStar(ctx, pos.x, pos.y, starRadius, isHovered ? 1 : 0.9, "cross");

                // Star flare (cross) for constellation stars
                if (starRadius > 3 * zoom) {
                    ctx.strokeStyle = isHovered
                        ? "rgba(200, 220, 255, 0.8)"
                        : "rgba(255, 255, 255, 0.5)";
                    ctx.lineWidth = 1 * zoom;
                    const flareSize = starRadius * 2.5;
                    ctx.beginPath();
                    ctx.moveTo(pos.x, pos.y - flareSize);
                    ctx.lineTo(pos.x, pos.y + flareSize);
                    ctx.moveTo(pos.x - flareSize, pos.y);
                    ctx.lineTo(pos.x + flareSize, pos.y);
                    ctx.stroke();
                }
            });
        });
    }, [offset, hoveredConstellation, width, height, zoom]);

    // Calculate nearest constellation for compass
    useEffect(() => {
        if (!showCompass) return;

        const centerX = width / 2;
        const centerY = height / 2;
        const currentScale = BASE_SCALE * zoom;

        let minDist = Infinity;
        let nearest: Constellation | null = null;
        let nearestPos = { x: 0, y: 0 };

        allConstellations.forEach((constellation) => {
            // Calculate average position of constellation stars
            let avgX = 0;
            let avgY = 0;
            constellation.stars.forEach((star) => {
                const pos = raDecToScreen(star.ra, star.dec, offset.x, offset.y, currentScale);
                avgX += pos.x;
                avgY += pos.y;
            });
            avgX /= constellation.stars.length;
            avgY /= constellation.stars.length;

            const dist = distance({ x: centerX, y: centerY }, { x: avgX, y: avgY });
            if (dist < minDist) {
                minDist = dist;
                nearest = constellation;
                nearestPos = { x: avgX, y: avgY };
            }
        });

        if (nearest) {
            const angle = Math.atan2(nearestPos.y - centerY, nearestPos.x - centerX);

            // Check if on screen (with some margin)
            const margin = 100;
            const isOnScreen =
                nearestPos.x >= margin &&
                nearestPos.x <= width - margin &&
                nearestPos.y >= margin &&
                nearestPos.y <= height - margin;

            setNearestConstellation({
                name: (nearest as Constellation).name,
                angle: angle,
                distance: minDist,
                screenPos: nearestPos,
                isOnScreen: isOnScreen,
            });
        }
    }, [offset, width, height, showCompass, zoom]);

    // Mouse/touch event handlers
    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const hasMovedRef = useRef(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = true;
        hasMovedRef.current = false;
        dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
        setIsDragging(true); // For cursor style

        // Add global listeners
        window.addEventListener("mousemove", handleWindowMouseMove);
        window.addEventListener("mouseup", handleWindowMouseUp);
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;

        // Calculate new offset
        let newX = e.clientX - dragStartRef.current.x;
        let newY = e.clientY - dragStartRef.current.y;

        // Check if moved significantly
        if (!hasMovedRef.current) {
            const dx = e.clientX - (dragStartRef.current.x + offset.x);
            const dy = e.clientY - (dragStartRef.current.y + offset.y);
            if (Math.sqrt(dx * dx + dy * dy) > 5) { // Threshold for "moved"
                hasMovedRef.current = true;
            }
        }

        // Strict Boundaries
        const currentScale = BASE_SCALE * zoom;
        const minRA = -18;
        const maxRA = 42;
        const minDec = -180;
        const maxDec = 180;

        const minRaPx = minRA * 15 * currentScale;
        const maxRaPx = maxRA * 15 * currentScale;
        const minDecPx = -maxDec * currentScale; // Y is inverted
        const maxDecPx = -minDec * currentScale;

        const maxOffsetX = -minRaPx;
        const minOffsetX = width - maxRaPx;
        const maxOffsetY = -minDecPx;
        const minOffsetY = height - maxDecPx;

        newX = Math.max(minOffsetX, Math.min(maxOffsetX, newX));
        newY = Math.max(minOffsetY, Math.min(maxOffsetY, newY));

        setOffset({ x: newX, y: newY });
    };

    const handleWindowMouseUp = (e: MouseEvent) => {
        isDraggingRef.current = false;
        setIsDragging(false);
        window.removeEventListener("mousemove", handleWindowMouseMove);
        window.removeEventListener("mouseup", handleWindowMouseUp);
    };

    // Handle Zoom
    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        const newZoom = Math.max(0.5, Math.min(2.0, zoom + delta)); // Limit zoom 0.5x to 2x

        if (newZoom !== zoom) {
            // Zoom towards mouse pointer
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate world position of mouse before zoom
            // Screen = World * Scale + Offset
            // World = (Screen - Offset) / Scale
            const currentScale = BASE_SCALE * zoom;
            const worldX = (mouseX - offset.x) / currentScale;
            const worldY = (mouseY - offset.y) / currentScale;

            // Calculate new offset to keep world position under mouse
            // NewOffset = Screen - World * NewScale
            const newScale = BASE_SCALE * newZoom;
            let newOffsetX = mouseX - worldX * newScale;
            let newOffsetY = mouseY - worldY * newScale;

            // Apply boundaries to new offset
            const minRA = -18;
            const maxRA = 42;
            const minDec = -180;
            const maxDec = 180;

            const minRaPx = minRA * 15 * newScale;
            const maxRaPx = maxRA * 15 * newScale;
            const minDecPx = -maxDec * newScale;
            const maxDecPx = -minDec * newScale;

            const maxOffsetXBound = -minRaPx;
            const minOffsetXBound = width - maxRaPx;
            const maxOffsetYBound = -minDecPx;
            const minOffsetYBound = height - maxDecPx;

            newOffsetX = Math.max(minOffsetXBound, Math.min(maxOffsetXBound, newOffsetX));
            newOffsetY = Math.max(minOffsetYBound, Math.min(maxOffsetYBound, newOffsetY));

            setZoom(newZoom);
            setOffset({ x: newOffsetX, y: newOffsetY });
        }
    };

    // We need to handle hover separately since we moved drag to window
    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDraggingRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const currentScale = BASE_SCALE * zoom;

        let found = false;
        for (const constellation of allConstellations) {
            const screenStars = constellation.stars.map((star) =>
                raDecToScreen(star.ra, star.dec, offset.x, offset.y, currentScale),
            );

            for (const pos of screenStars) {
                if (distance({ x: mouseX, y: mouseY }, pos) < 30) {
                    setHoveredConstellation(constellation);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (!found) {
            setHoveredConstellation(null);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        // Only trigger if we haven't moved (clicked)
        if (!hasMovedRef.current && hoveredConstellation) {
            window.open(hoveredConstellation.link, "_blank");
        }
    };

    // Clean up listeners on unmount
    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", handleWindowMouseMove);
            window.removeEventListener("mouseup", handleWindowMouseUp);
        };
    }, []);

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={`${hoveredConstellation ? "cursor-pointer" : isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onClick={handleClick}
                onWheel={handleWheel}
            />

            {/* Controls Container */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                {/* Reset Button */}
                <button
                    onClick={() => {
                        setOffset({ x: width / 2, y: height / 2 });
                        setZoom(1);
                    }}
                    className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full backdrop-blur-sm transition-colors border border-gray-600"
                    title="Reset View"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                </button>

                {/* Compass Toggle */}
                <button
                    onClick={() => setShowCompass(!showCompass)}
                    className="bg-gray-800/80 hover:bg-gray-700 text-white p-2 rounded-full backdrop-blur-sm transition-colors border border-gray-600"
                    title={showCompass ? "Hide Compass" : "Show Compass"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                </button>
            </div>

            {/* Compass / Beacon Indicator */}
            {showCompass && nearestConstellation && (
                nearestConstellation.isOnScreen ? (
                    // Beacon Mode (On Screen)
                    <div
                        className="absolute w-32 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500"
                        style={{
                            left: nearestConstellation.screenPos.x - 64, // Center the 128px (32rem is wrong, w-32 is 8rem=128px) width div
                            top: nearestConstellation.screenPos.y - 80, // Position above
                        }}
                    >
                        <div className="flex flex-col items-center animate-bounce">
                            <div className="text-blue-300 font-bold text-lg text-shadow-glow mb-1">
                                {nearestConstellation.name}
                            </div>
                            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-blue-400"></div>
                        </div>
                    </div>
                ) : (
                    // Off-screen Indicator Mode
                    <div
                        className="absolute w-12 h-12 flex items-center justify-center pointer-events-none transition-transform duration-100"
                        style={{
                            left: width / 2,
                            top: height / 2,
                            transform: (() => {
                                // Vector to target
                                const dx = Math.cos(nearestConstellation.angle);
                                const dy = Math.sin(nearestConstellation.angle);

                                // Distance to screen edge (with padding)
                                const padding = 60;
                                const edgeX = width / 2 - padding;
                                const edgeY = height / 2 - padding;

                                // Calculate intersection with screen bounds
                                let t = Infinity;

                                if (dx !== 0) {
                                    const tx = (dx > 0 ? edgeX : -edgeX) / dx;
                                    if (tx > 0) t = Math.min(t, tx);
                                }
                                if (dy !== 0) {
                                    const ty = (dy > 0 ? edgeY : -edgeY) / dy;
                                    if (ty > 0) t = Math.min(t, ty);
                                }

                                const x = t * dx;
                                const y = t * dy;

                                return `translate(${x - 24}px, ${y - 24}px)`;
                            })()
                        }}
                    >
                        <div className="relative flex flex-col items-center">
                            {/* Arrow pointing to target */}
                            <div
                                className="w-8 h-8 text-blue-400 filter drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                                style={{ transform: `rotate(${nearestConstellation.angle * (180 / Math.PI) + 90}deg)` }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L22 22L12 18L2 22L12 2Z" />
                                </svg>
                            </div>

                            {/* Label */}
                            <div className="absolute top-full mt-1 flex flex-col items-center">
                                <span className="text-blue-200 font-bold text-sm whitespace-nowrap text-shadow-sm">
                                    {nearestConstellation.name}
                                </span>
                                <span className="text-blue-400/80 text-xs font-mono">
                                    {Math.round(nearestConstellation.distance / 10)}u
                                </span>
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* Profile at Spawn (Center) */}
            <div
                className="absolute pointer-events-none flex flex-col items-center justify-center text-center"
                style={{
                    left: offset.x,
                    top: offset.y,
                    transform: "translate(-50%, -50%)",
                }}
            >
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-widest opacity-90 mb-2">
                    Sebastian Savary
                </h1>
                <h2 className="text-xl md:text-2xl text-blue-300 font-light tracking-[0.2em] uppercase mb-4">
                    Project: Carina
                </h2>
                <div className="flex flex-col gap-1 text-blue-200/60 text-sm md:text-base font-mono">
                    <p>Developer</p>
                    <p>Build with the help of Gemini AI</p>
                </div>
            </div>

            {/* Skills Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x - 800,
                    top: offset.y - 400,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">SKILLS</h3>
                    <div className="space-y-3 text-sm text-blue-100/90">
                        <div>
                            <h4 className="font-semibold text-blue-200 mb-1">Languages</h4>
                            <p className="text-blue-100/70">JavaScript, TypeScript, HTML, SQL, Python, Learning Dart</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-200 mb-1">Tools</h4>
                            <p className="text-blue-100/70">Git, GitHub, VSCode, Word, Excel, PowerPoint, Docker, Linux, macOS, Windows</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x + 800,
                    top: offset.y - 400,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">EXPERIENCE</h3>
                    <div className="text-sm text-blue-100/90">
                        <p className="text-blue-100/70 text-center italic">No professional experience for now</p>
                    </div>
                </div>
            </div>

            {/* Interests Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x,
                    top: offset.y + 500,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">INTERESTS</h3>
                    <div className="space-y-2 text-sm text-blue-100/90">
                        <p className="text-blue-100/70">🎮 Video Games</p>
                        <p className="text-blue-100/70">🏗️ Building Stuff</p>
                        {/* <p className="text-blue-100/70">📚 Books</p> */}
                        <p className="text-blue-100/70">🔬 Homelab</p>
                    </div>
                </div>
            </div>

            {/* Contact Section Card */}
            <div
                className="absolute pointer-events-auto w-80"
                style={{
                    left: offset.x + 800,
                    top: offset.y + 500,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">SOCIALS</h3>
                    <div className="space-y-3 text-sm text-blue-100/90">
                        <a href="mailto:akari@runerra.org" className="flex items-center gap-2 text-blue-100/70 hover:text-blue-300 transition-colors">
                            <span>📧</span>
                            <span>akari@runerra.org</span>
                        </a>
                        <a href="https://github.com/Runerra-Hakushii" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-100/70 hover:text-blue-300 transition-colors">
                            <span>💻</span>
                            <span>GitHub</span>
                        </a>
                        {/* <a href="https://www.linkedin.com/in/sebastián-savary-124961369/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-100/70 hover:text-blue-300 transition-colors">
                            <span>🔗</span>
                            <span>LinkedIn</span>
                        </a> */}
                    </div>
                </div>
            </div>

            {/* Bio Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x - 800,
                    top: offset.y + 500,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">BIO</h3>
                    <div className="text-sm text-blue-100/90 space-y-2">
                        <p className="text-blue-100/70">
                            idk
                        </p>
                        <p className="text-blue-100/70">

                        </p>
                    </div>
                </div>
            </div>

            {/* Education Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x - 1200,
                    top: offset.y,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">EDUCATION</h3>
                    <div className="space-y-3 text-sm text-blue-100/90">
                        <div>
                            <h4 className="font-semibold text-blue-200">Middle School</h4>
                            <p className="text-blue-100/70 text-xs">SPS Snina - Technické Lýceum • 2022-2026</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-200">CS50P</h4>
                            <p className="text-blue-100/70 text-xs">Harvard • 2025</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificates Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x + 1200,
                    top: offset.y,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">CERTIFICATES</h3>
                    <div className="space-y-2 text-sm text-blue-100/90">
                        <p className="text-blue-100/70">🏆 CCNA 1</p>
                        <p className="text-blue-100/70">🏆 CS50P</p>
                        <p className="text-blue-100/70">🏆 Cisco IT Essentials</p>
                    </div>
                </div>
            </div>

            {/* Languages Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x - 400,
                    top: offset.y - 600,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">LANGUAGES</h3>
                    <div className="space-y-2 text-sm text-blue-100/90">
                        <p className="text-blue-100/70">🇬🇧 English - B2</p>
                        <p className="text-blue-100/70">🇸🇰 Slovak - Native</p>
                        {/* <p className="text-blue-100/70">🇯🇵 Japanese - N5</p> */}
                    </div>
                </div>
            </div>

            {/* Projects Section Card */}
            <div
                className="absolute pointer-events-none w-80"
                style={{
                    left: offset.x,
                    top: offset.y - 500,
                }}
            >
                <div className="bg-gray-900/80 backdrop-blur-md border border-blue-400/30 rounded-lg p-6 w-full">
                    <h3 className="text-2xl font-bold text-blue-300 mb-4 tracking-wide">PROJECTS</h3>
                    <div className="text-sm text-blue-100/90 space-y-3">
                        <p className="text-blue-200 text-center italic">
                            ✨ Explore the star map to discover my projects! ✨
                        </p>
                        <p className="text-blue-100/70 text-center text-xs">
                            Each constellation represents a project. Click on them to learn more. Use the compass to find the nearest one.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}
