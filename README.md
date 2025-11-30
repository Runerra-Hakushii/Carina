# Carina - Interactive Portfolio

An interactive, space-themed portfolio website featuring a navigable star map where each constellation represents a different project. Built with Next.js and TypeScript.

## ✨ Features

- **Interactive Star Map**: Drag to pan and explore a canvas-based night sky with 2500+ realistic stars
- **Constellation Projects**: Click on constellations (Lynx, Lyra, Aquila, Carina, Horologium, Astraeus) to view project details
- **Zoom & Navigation**: Mouse wheel to zoom (0.5x-2.0x), reset button to return to spawn
- **Smart Compass**: Adaptive navigation that points to the nearest constellation, transforms into a beacon when on-screen
- **CV Sections**: Discover floating cards with bio, skills, experience, education, certificates, languages, interests, and contact info

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas Rendering**: HTML5 Canvas API
- **Animation**: Custom zoom/pan mechanics with boundary physics

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Run with Docker
pnpm run docker-build
pnpm run docker-run
```

Open [http://localhost:3742](http://localhost:3742) to view the portfolio.

## 📂 Project Structure

```
/app                    # Next.js app directory
/components/ui          # UI components (star-map.tsx)
/lib
  /constellations       # Constellation data files
  coordinates.ts        # RA/Dec to screen coordinate conversion
```

## 🎨 Customization

Update constellation data in `/lib/constellations/` to link to your projects. Each constellation file contains:
- Star positions (Right Ascension & Declination)
- Star connections (forming the constellation pattern)
- Project link

## 📝 License

MIT

---

**Built with the help of Gemini AI**
