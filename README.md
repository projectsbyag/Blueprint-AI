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

### 🤖 Intelligent AI Layout Generation
- **Freeform Creative Synthesis**: Describe your vision in plain English (e.g. *"Minimalist SaaS product launch post with neon cyan accents and bold headline"* or *"A 5-step cloud computing roadmap infographic"*).
- **Gemini 2.5 Flash Engine**: Leverages `@google/genai` to analyze design semantics and synthesize fully coordinated coordinate positions, aspect ratios, responsive element hierarchies, typography, and palette pairings.
- **Layout Variator**: Generate multi-layout alternatives with 1 click to test different compositional layouts.

### 🎠 Multi-Slide Carousels (LinkedIn, Instagram & Presentations)
- **Slide Carousel Tray**: Visual slide thumbnail reel at the bottom of the canvas with drag-to-reorder, duplicate, add, and delete controls.
- **Independent Canvas Canvas State**: Each slide preserves its own unique canvas background color, element hierarchies, groups, and z-indexes.
- **Multi-Slide AI Generation**: Request multi-slide themes and carousels directly from the AI prompt.

### 📐 Interactive Vector Canvas
- **Direct Drag & Resize**: Intuitive 8-point boundary handles with active snap feedback.
- **Precision Element Grouping**: Select multiple elements via Shift-Click or Drag marquee (`Ctrl + G` to group, `Ctrl + Shift + G` to ungroup). Grouped items drag and scale synchronously as a unified unit.
- **Dynamic Auto-Fit Zoom**: Smart viewport scaler that automatically calculates the optimal canvas scale when panels collapse or screen dimensions change.
- **Alignment & Snapping**: Center horizontally, center vertically, auto-distribute spacing, and snap to visual grid.
- **30-Step Undo & Redo History**: Complete state journal tracking element additions, deletions, group operations, and layout shifts (`Ctrl + Z` / `Ctrl + Y`).
- **Experimental Palette Shifter**: 1-click harmony cycle testing curated themes (*Midnight Luxe*, *Nordic Minimalist*, *Cyberpunk Neon*, *Earthy Warmth*).

### 🎛️ Responsive & Collapsible Panels
- **Adjustable Widths**: Drag handles on panel borders to resize both the Toolbox (260px–550px) and the Properties Inspector (260px–500px).
- **Collapsible Icon Rails**: Collapse either panel into an ultra-slim vertical icon rail to maximize canvas real estate.
- **1-Click Header Toggles**: Dedicated *Tools* and *Properties* quick-toggle buttons in the top navigation bar.

### 🎨 Curated Design Controls
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
