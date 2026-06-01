# ✨ AuraQuotes | Premium Immersive Quote Generator

AuraQuotes is a modern, luxurious, and highly interactive quote discovery web application built as part of the **30 Days Web Development Challenge (Day 9)**. Combining React, custom glassmorphism styling, and native browser Web APIs, AuraQuotes delivers an inspiring quote exploration experience wrapped in dynamic, color-shifting glowing ambient backdrops.

---

## 🌟 Key Features

*   **🎨 Dynamic OKLCH Mood Auras**: Shifting between active quote moods (Wisdom, Courage, Success, Peace, Joy, Love) automatically morphs the ambient color gradients in high-chroma `oklch` interpolation space.
*   **🗣️ Text-To-Speech (TTS)**: Built-in Speech Synthesis reads quotes and authors aloud using the highest quality browser voices at a calm, reflective speed.
*   **📊 Animated Voice Wave Visualizer**: Renders a rhythmic CSS-animated wave indicator that dances in sync with the audio playback when the reader is active.
*   **💾 Local Favorites Shelf**: A slide-out drawer lets users save their favorite quotes, search their favorites library by keyword or author, share on Twitter/X, and reload them back into the main display card.
*   **🔌 Hybrid Delivery Engine**: Seamlessly fetches randomly from the public `DummyJSON API` for general quote discovery, while using a robust, highly curated 100+ local quote database for specific mood filtering or as a bulletproof offline fallback.
*   **🔔 Stackable Glassmorphic Toasts**: Elegant micro-notifications that slide up to confirm actions like text copying, favoriting, or API fallback alerts.

---

## 🛠️ Technology Stack

1.  **Core Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (Client-side single page app)
2.  **Styling**: Pure CSS (Vanilla) leveraging:
    *   `oklch()` color system for high-gamut, vibrant color blending
    *   `backdrop-filter: blur()` glassmorphism styles
    *   Discrete transition behaviors and starting-styles for layout animation controls
    *   Fluid keyframes and custom scrollbars
3.  **Browser Web APIs**:
    *   `SpeechSynthesis` API (Text-to-speech engine)
    *   `Clipboard` API (Copy-to-clipboard actions)
    *   `LocalStorage` API (Favorites list persistence)
    *   `Fetch` API (Public quotes retrieval)
4.  **Icons & Vector Graphics**: Custom inlined and optimized SVG graphics for fast rendering and direct CSS control.

---

## 📂 Project Structure

```text
DAY9 --QUOTE GENERATOR/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── AudioVisualizer.jsx   # TTS wave feedback lines
│   │   ├── FavoritesDrawer.jsx   # Sliding saved quotes list
│   │   ├── QuoteCard.jsx         # Main glass container card
│   │   └── Toast.jsx             # Stackable glass toast notifications
│   ├── data/
│   │   └── fallbackQuotes.js     # Curated 100+ offline quotes database
│   ├── App.css                   # Empty style buffer
│   ├── App.jsx                   # Central state orchestrator and API bindings
│   ├── index.css                 # OKLCH design variables, glassmorphic layout, scrollbars
│   └── main.jsx                  # StrictMode entrypoint
├── index.html              # Custom fonts & viewport configuration
├── vite.config.js          # Vite React compiler settings
├── package.json            # Node project configuration
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  Navigate into the project directory:
    ```bash
    cd "DAY9 --QUOTE GENERATOR"
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Run Locally (Development)

Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open the provided browser URL (usually `http://localhost:5173`) to view and interact with the application.

### Build for Production

Compile and optimize the assets for production deployment:
```bash
npm run build
```
This builds static assets into the `dist/` folder ready to be served on platforms like Netlify, Vercel, or GitHub Pages.
