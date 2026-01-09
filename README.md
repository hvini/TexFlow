# TeXFlow 🚀

**TeXFlow** is a modern, visual, graph-based LaTeX editor. It allows you to build complex technical documents by connecting logical blocks instead of writing raw code. See your document's structure as a flow, and let TeXFlow handle the syntax.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61dafb.svg)
![Vite](https://img.shields.io/badge/build-Vite-646cff.svg)

## ✨ Features

- **🎯 Logic-First Drafting**: Build your document using Sections, Content, and Image nodes.
- **🖼️ Smart Image Tooling**: 
    - Local image uploads (no external URLs needed).
    - Automatic pixel normalization (fixes orientation issues).
    - Real-time rotation and alignment controls.
- **⚡ Supercharged Productivity**:
    - **Box Selection**: Drag to select multiple nodes instantly.
    - **Smart Cloning**: `Ctrl+D` to duplicate entire document structures with internal connections preserved.
    - **Bulk Actions**: Delete entire branches or selections with one key.
- **📄 Live TeXLive Preview**: Integrated LaTeX compiler (using `texlive.js`) with a real-time PDF viewer.
- **📤 Overleaf Ready**: Export your entire project as a ZIP file, including `main.tex` and all bundled assets, ready to be uploaded to Overleaf.

## 🛠️ Tech Stack

- **React Flow**: The engine behind the graph interface.
- **Zustand**: Lightweight, high-performance state management.
- **TeXLive.js**: WebWorker-based TeX engine running locally in the browser.
- **Tailwind CSS**: Modern, premium UI design.
- **JSZip**: Handling project exports.

## 🚀 Getting Started

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/TeXFlow.git
   cd TeXFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Start building**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

- **Add Nodes**: Use the "Editor Tools" sidebar to add document elements.
- **Select**: Click and drag on the canvas to select multiple blocks.
- **Clone**: Press `Ctrl+D` to duplicate selected nodes.
- **Export**: Click "Export ZIP" to get an Overleaf-compatible project bundle.

---

Built with ❤️ for the LaTeX community.
