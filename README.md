Copy everything inside this block into `README.md`:

```markdown
# Blueprint AI

Blueprint AI is an AI-powered graphic design and carousel studio for creating professional layouts, social media graphics, presentations, infographics, and marketing materials.

The application combines a visual canvas editor with Google Gemini AI to help users create, customize, and export designs.

## Features

### AI-Powered Design Tools

- Generate design layouts with Google Gemini
- Rewrite and improve headlines and copy
- Generate creative text suggestions
- Create structured visual blueprints from user prompts

### Graphic Design Editor

- Drag-and-drop canvas editing
- Add and customize text, shapes, images, arrows, cards, buttons, and decorative elements
- Adjust colors, borders, shadows, opacity, rotation, and corner radius
- Lock and unlock elements
- Align and reorder layers
- Flip and rotate design elements
- Apply image filters and aspect-ratio presets

### Templates

Blueprint AI includes curated templates for:

- Product launches
- Investor pitch decks
- Developer roadmaps
- Architecture infographics
- Real estate flyers
- Marketing campaigns
- Social media carousels
- Business and career content

Templates can be searched and filtered by category.

### Carousel and Multi-Page Designs

- Create multi-slide carousel presentations
- Manage multiple pages from the carousel tray
- Maintain consistent layouts across slides
- Design content for LinkedIn, social media, presentations, and marketing campaigns

### Export Options

- Export complete carousel projects as PDF
- Export individual slides as PDF
- Export slides as PNG images
- Batch export multiple slides as PNG files
- Save and restore projects using JSON files

### Authentication

- Login and signup pages
- Local session support
- Guest demo mode
- User authentication context

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **UI:** React
- **Styling:** Tailwind CSS
- **Components:** Radix UI and shadcn/ui patterns
- **Icons:** Lucide React
- **AI:** Google Gemini and Genkit
- **PDF Export:** jsPDF
- **Forms:** React Hook Form
- **Validation:** Zod
- **Animations:** Motion
- **Charts:** Recharts

## Requirements

Before running the project, make sure you have:

- Node.js 18 or newer
- npm, yarn, pnpm, or Bun
- A Google Gemini API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/projectsbyag/Blueprint-AI.git
cd Blueprint-AI
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

You can create a Gemini API key through Google AI Studio.

### 4. Start the development server

Using npm:

```bash
npm run dev
```

Or using Bun:

```bash
bun run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Builds the application for production |
| `npm start` | Starts the production server |
| `npm run lint` | Runs TypeScript checks |
| `npm run typecheck` | Runs TypeScript type checking |
| `npm run genkit:dev` | Starts the Genkit development server |
| `npm run genkit:watch` | Starts Genkit in watch mode |

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + Z` / `Cmd + Z` | Undo the last canvas action |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo an action |
| `Ctrl + G` / `Cmd + G` | Group selected elements |
| `Ctrl + Shift + G` / `Cmd + Shift + G` | Ungroup selected elements |
| `Ctrl + D` / `Cmd + D` | Duplicate selected elements |
| `Delete` / `Backspace` | Remove selected elements |
| `Arrow Keys` | Move an element by 1 pixel |
| `Shift + Arrow Keys` | Move an element by 10 pixels |
| `Shift + Click` | Add an element to a multi-selection |
| `Escape` | Deselect all elements |

## Project Structure

```text
.
├── docs/
├── public/
├── src/
│   ├── ai/
│   │   └── dev.ts
│   ├── app/
│   │   ├── blueprint/          # Main design studio
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── layout.tsx          # Root application layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── canvas/             # Canvas and carousel components
│   │   ├── editors/            # Text, shape, image, and property editors
│   │   ├── layout/             # Application layout panels
│   │   ├── shared/             # Shared application components
│   │   ├── tools/              # AI tools, templates, layers, and elements
│   │   └── ui/                 # Reusable UI components
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication and guest session context
│   ├── lib/
│   │   ├── actions.ts          # Server-side AI actions
│   │   └── utils.ts            # Utility functions
│   └── types/
│       ├── auth.ts             # Authentication types
│       └── blueprint.ts        # Blueprint and design types
├── .env.example
├── components.json
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## How It Works

1. Open Blueprint AI in your browser.
2. Choose a template or start with a blank canvas.
3. Add text, images, shapes, and other design elements.
4. Use the AI tools to generate or improve content.
5. Customize the layout using the editor controls.
6. Add additional carousel slides when needed.
7. Export the finished design as PDF or PNG.

## AI Features

Blueprint AI uses Google Gemini to assist with design and content creation.

AI features may include:

- Layout generation
- Headline suggestions
- Copy rewriting
- Content improvement
- Design recommendations
- Visual blueprint generation

Keep your Gemini API key private and never commit it to the repository.

## Deployment

Blueprint AI can be deployed to platforms that support Next.js, including:

- Vercel
- Netlify
- Render
- Railway
- AWS

Before deploying, configure the following environment variable in your hosting provider:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

To create a production build locally:

```bash
npm run build
npm start
```

## Contributing

Contributions, suggestions, bug reports, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes.
4. Run the type checks:

   ```bash
   npm run typecheck
   ```

5. Build the project:

   ```bash
   npm run build
   ```

6. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

7. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

8. Open a pull request.

## Security

Do not commit private credentials or API keys to the repository.

Use environment variables for sensitive values such as:

- Gemini API keys
- Authentication secrets
- Database credentials
- Third-party service tokens

If an API key is accidentally exposed, revoke it and generate a new one immediately.

## License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Author

Created by [projectsbyag](https://github.com/projectsbyag).
```