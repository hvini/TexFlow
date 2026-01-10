import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import JSZip from 'jszip';

import RootNode from '../nodes/RootNode';
import SectionNode from '../nodes/SectionNode';
import ContentNode from '../nodes/ContentNode';
import ImageNode from '../nodes/ImageNode';
import DeletableEdge from '../nodes/DeletableEdge';
import { generateLatex } from '../utils/latexGenerator';
import { pdfTex } from '../utils/PdfTexEngine';
import useStore from '../store';

const nodeTypes = {
  rootNode: RootNode,
  sectionNode: SectionNode,
  contentNode: ContentNode,
  imageNode: ImageNode,
};

const edgeTypes = {
  deletableEdge: DeletableEdge,
};

const nodesSelector = (state) => state.nodes;
const edgesSelector = (state) => state.edges;
const onNodesChangeSelector = (state) => state.onNodesChange;
const onEdgesChangeSelector = (state) => state.onEdgesChange;
const onConnectSelector = (state) => state.onConnect;
const addNodeSelector = (state) => state.addNode;
const duplicateSelectionSelector = (state) => state.duplicateSelection;
const deleteSelectionSelector = (state) => state.deleteSelection;

export default function App() {
  const nodes = useStore(nodesSelector);
  const edges = useStore(edgesSelector);
  const onNodesChange = useStore(onNodesChangeSelector);
  const onEdgesChange = useStore(onEdgesChangeSelector);
  const onConnect = useStore(onConnectSelector);
  const addNode = useStore(addNodeSelector);
  const duplicateSelection = useStore(duplicateSelectionSelector);
  const deleteSelection = useStore(deleteSelectionSelector);

  const [latexCode, setLatexCode] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [activeTab, setActiveTab] = useState('code');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState(null);

  useEffect(() => {
    const { code, images } = generateLatex(nodes, edges);
    setLatexCode(code);
    setCurrentImages(images);
  }, [nodes, edges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        duplicateSelection();
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duplicateSelection, deleteSelection]);

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileError(null);
    setActiveTab('pdf');

    try {
      const url = await pdfTex.compile(latexCode, currentImages);
      setPdfUrl(url);
    } catch (err) {
      setCompileError('Failed to compile PDF. Please check your LaTeX syntax or image URLs.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleExportProject = async () => {
    const zip = new JSZip();
    zip.file('main.tex', latexCode);

    // Add images to zip
    for (const img of currentImages) {
      if (img.url.startsWith('data:')) {
        const base64Data = img.url.split(',')[1];
        zip.file(img.name, base64Data, { base64: true });
      } else {
        try {
          const response = await fetch(img.url);
          const buffer = await response.arrayBuffer();
          zip.file(img.name, buffer);
        } catch (e) {
          console.error(`Failed to include image ${img.name} in export:`, e);
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `latex_project_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddSection = () => {
    addNode({
      id: `section-${Date.now()}`,
      type: 'sectionNode',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { title: '' },
    });
  };

  const handleAddContent = () => {
    addNode({
      id: `content-${Date.now()}`,
      type: 'contentNode',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 200 },
      data: { content: '' },
    });
  };

  const handleAddImage = () => {
    addNode({
      id: `image-${Date.now()}`,
      type: 'imageNode',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 300 },
      data: { url: '', width: '0.8', align: 'center' },
    });
  };

  const hasSelection = nodes.some(n => n.selected && n.type !== 'rootNode') || edges.some(e => e.selected);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden font-sans">
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.2}
          maxZoom={2}
          selectionOnDrag
          panOnDrag={[1, 2]}
          selectionMode="partial"
          className="bg-gray-900"
        >
          <Background variant="dots" gap={20} size={1} color="#4b5563" />
          <Controls className="bg-white/10 border border-white/20 rounded-md overflow-hidden" />
        </ReactFlow>

        <div className="absolute top-6 left-6 flex flex-col gap-3 bg-gray-800/90 backdrop-blur-md border border-gray-600 p-4 rounded-xl shadow-2xl z-50">
          <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Editor Tools</h3>

          <div className="flex flex-col gap-2 border-b border-gray-700 pb-3 mb-1">
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 rounded text-sm font-semibold transition-all flex items-center gap-2 text-cyan-100"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Add Section
            </button>
            <button
              onClick={handleAddContent}
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 rounded text-sm font-semibold transition-all flex items-center gap-2 text-emerald-100"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Add Content
            </button>
            <button
              onClick={handleAddImage}
              className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/50 rounded text-sm font-semibold transition-all flex items-center gap-2 text-amber-100"
            >
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Add Image
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={duplicateSelection}
              disabled={!hasSelection}
              className={`px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 border shadow-lg ${hasSelection
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-100 hover:bg-indigo-600/50 hover:shadow-indigo-500/20'
                : 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Clone Selection
            </button>
            <button
              onClick={deleteSelection}
              disabled={!hasSelection}
              className={`px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 border shadow-lg ${hasSelection
                ? 'bg-rose-600/30 border-rose-500 text-rose-100 hover:bg-rose-600/50 hover:shadow-rose-500/20'
                : 'bg-gray-700/50 border-gray-600 text-gray-500 cursor-not-allowed'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selection
            </button>
          </div>
        </div>
      </div>


      <div className="w-[450px] border-l border-gray-700 bg-gray-950 flex flex-col shadow-2xl z-10 transition-all">
        <div className="p-3 border-b border-gray-800 bg-gray-900/50 flex flex-col gap-3">
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-lg font-bold text-gray-100">Preview</h2>
              <p className="text-xs text-gray-500">
                {activeTab === 'code' ? 'Generated LaTeX' : 'Compiled PDF'}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ${isCompiling ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]`}></div>
          </div>

          <div className="flex bg-gray-900 rounded p-1 border border-gray-800">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${activeTab === 'code' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
            >
              CODE
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${activeTab === 'pdf' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
            >
              PDF VIEW
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-black/20 flex flex-col relative">
          {activeTab === 'code' && (
            <div className="flex-1 p-4 custom-scrollbar overflow-auto">
              <pre className="font-mono text-sm text-green-400/90 whitespace-pre-wrap leading-relaxed">
                {latexCode}
              </pre>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="flex-1 flex flex-col h-full bg-gray-600/20 justify-center items-center">
              {isCompiling && (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-indigo-300 font-mono text-sm">Compiling with TeXLive...</span>
                </div>
              )}

              {!isCompiling && !pdfUrl && !compileError && (
                <div className="text-gray-500 text-center px-10">
                  <p className="mb-4">No PDF compiled yet.</p>
                  <button onClick={handleCompile} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm text-white">
                    Compile Now
                  </button>
                </div>
              )}

              {!isCompiling && compileError && (
                <div className="text-red-400 p-6 text-center text-sm font-mono bg-red-900/20 rounded border border-red-900/50 m-4">
                  {compileError}
                </div>
              )}

              {!isCompiling && pdfUrl && (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/30 flex flex-col gap-2">
          {activeTab === 'code' ? (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(latexCode);
                }}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs font-mono text-gray-300 transition-colors uppercase tracking-widest"
              >
                Copy Code
              </button>
              <button
                onClick={handleExportProject}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded text-xs font-mono text-white transition-colors uppercase tracking-widest font-bold flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Zip
              </button>
              <button
                onClick={handleCompile}
                className="flex-1 py-2 bg-indigo-700 hover:bg-indigo-600 border border-indigo-500 rounded text-xs font-mono text-white transition-colors uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                Compile PDF
              </button>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleExportProject}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded text-xs font-mono text-white transition-colors uppercase tracking-widest font-bold flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Zip
              </button>
              <button
                onClick={handleCompile}
                className="flex-1 py-2 bg-indigo-700 hover:bg-indigo-600 border border-indigo-500 rounded text-xs font-mono text-white transition-colors uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                {isCompiling ? 'Compiling...' : 'Recompile'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
