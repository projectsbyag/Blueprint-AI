# Blueprint — AI Graphics & Carousel Studio

<p align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Blueprint AI Studio" width="100%" style="border-radius: 12px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>A full-featured, AI-powered graphic design and multi-slide carousel studio built with Next.js 15, TypeScript, Tailwind CSS, and Google Gemini.</strong>
</p>

<p align="center">
  <a href="#core-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#keyboard-shortcuts">Shortcuts</a> •
  <a href="#export-options">Exporting</a> •
  <a href="#architecture">Architecture</a>
</p>

---

## ✨ Core Features

### 📋 16 Curated High-Converting Templates
- **Rich Presets Across Categories**: 1-click loading for multi-slide carousel decks (Product Launch, Investor Pitch Deck), developer roadmaps & architecture infographics, luxury real estate flyers, keynote tech posters, cyberpunk events, fitness challenges, hiring announcements, pricing tables, and award certificates.
- **Search & Category Filtering**: Instantly search templates or filter by *Carousels*, *Infographics*, *Marketing & Sales*, *Social & Media*, and *Business & Career*.
- **Instant Canvas Initialization**: Applies balanced layout composition, typographic hierarchy, responsive coordinates, and palette pairings instantly to the artboard.

### ✍️ AI-Powered Copy & Headline Polish
- **Contextual Copy Rewriter**: Select any text element on canvas to generate punchy, high-converting headline and copy suggestions with 1 click.
- **Smart Headline Replacer**: Preview alternative suggestions directly in the inspector and click to replace instantly.

### 📐 Canva-Grade Design Tools & Elements
- **Shapes & Vector Arrows**: Right arrows, left arrows, double-ended connectors, sharp triangles, 5-point stars, starburst ribbons, quote bubbles, glassmorphic frosted cards, and pills.
- **Canva Style Properties**:
  - **Border Controls**: Width slider (0–30px), border styles (Solid, Dashed, Dotted, Double, None), and custom color swatches.
  - **Corner Radius**: Sharp (0px), Soft (8px), Card (20px), Full Pill/Circle (9999px).
  - **Canva Shadow Presets**: None, Soft, Elevated, Neon Glow, Retro Hard, and Dramatic Deep.
  - **Transforms & Snaps**: Slider (-180° to 180°), quick snap buttons (0°, 90°, 180°, 270°), Flip Horizontal, and Flip Vertical.
  - **Lock / Unlock Elements**: Prevent accidental dragging or resizing of background layers.
  - **Canva Alignment & Layer Stack**: 6-point alignment (Left, Center X, Right, Top, Center Y, Bottom) plus Bring to Front, Forward, Backward, and Send to Back.
  - **Text Enhancements**: Text transform (UPPERCASE, lowercase, Capitalize), text decoration (Underline, Strikethrough), and text highlight badges.
  - **Image Filters & Presets**: Aspect ratio presets (1:1, 16:9, 3:4, Circle Avatar) and visual filters (Grayscale, High Contrast, Warm Vintage, Cool Minimal).
- **Preset Color Swatches**: Categorized palette picker (Neutrals & Monochrome, Vibrant Primaries, Pastels & Earthy) plus custom hex input for background colors, text colors, and shape borders.
- **Curated Web Typography**: Visual preset selector featuring popular fonts (*Inter*, *Space Grotesk*, *Poppins*, *Playfair Display*, *Montserrat*, *Roboto*, *Oswald*, *JetBrains Mono*) with live preview rendering.
- **Shapes & Icon Library**: Rectangles, circles, badges, cards, dividers, buttons, and decorative motifs with adjustable border radius, opacity, and rotation.
- **Image Integration**: Add images via URL with fit modes, aspect ratios, and rounded corners.

### 📄 Export & Publishing
- **Multi-Page PDF Export**: Compile all carousel slides into a clean, presentation-ready PDF document for LinkedIn decks or pitches (powered by `jspdf`).
- **Single Slide PDF & PNG**: High-resolution print-ready exports.
- **Batch PNG Export**: Download all carousel slides as individual image assets with 1 click.
- **JSON Project Portability**: Save and restore editable design schemas.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Server Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with `tailwindcss-animate`
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives + [shadcn/ui](https://ui.shadcn.com/) patterns
- **Icons**: [Lucide React](https://lucide.dev/)
- **Generative AI**: Official Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash
- **Document Generation**: [jsPDF](https://github.com/parallax/jsPDF) (Client-side vector/canvas compiler)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm, yarn, or pnpm
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/blueprint.git
   cd blueprint
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Undo last canvas action |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo action |
| `Ctrl + G` / `Cmd + G` | Group selected elements |
| `Ctrl + Shift + G` / `Cmd + Shift + G` | Ungroup selected elements |
| `Ctrl + D` / `Cmd + D` | Duplicate selected element(s) |
| `Delete` / `Backspace` | Remove selected element(s) |
| `Arrow Keys` | Nudge element position (1px) |
| `Shift + Arrow Keys` | Nudge element position (10px) |
| `Shift + Click` | Add element to multi-selection |
| `Escape` | Deselect all elements |

---

## 📦 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── blueprint/          # Main Canvas & Carousel Studio route
│   │   ├── login/              # User Authentication (Session / Demo Mode)
│   │   ├── signup/             # New Account Registration
│   │   ├── layout.tsx          # Root Layout & Typography Font Preloads
│   │   └── page.tsx            # Marketing Landing & Feature Showcase
│   ├── components/
│   │   ├── canvas/             # Canvas, CanvasElement, CarouselTray
│   │   ├── editors/            # Properties, Shape, Text, Image Editors
│   │   ├── layout/             # LeftPanel, CenterPanel, RightPanel
│   │   ├── shared/             # AppHeader with Export Engine
│   │   ├── tools/              # AI Design Tool, Templates, Element Library, Layers
│   │   └── ui/                 # Reusable Radix & Preset Pickers
│   ├── context/
│   │   └── AuthContext.tsx     # Local Session & Guest Demo Auth Provider
│   ├── lib/
│   │   ├── actions.ts          # Server Action: Server-side Gemini AI layout synthesis
│   │   └── utils.ts            # Class merging and formatting utilities
│   └── types/
│       ├── auth.ts             # Auth User & Credential interfaces
│       └── blueprint.ts        # DesignLayout, DesignElement, DesignPage schemas
├── package.json
└── tailwind.config.ts
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
