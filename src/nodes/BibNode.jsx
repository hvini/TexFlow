import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

const BibNode = ({ id, data }) => {
    const updateNodeData = useStore((state) => state.updateNodeData);
    const docClass = useStore((state) =>
        state.nodes.find((n) => n.type === 'rootNode')?.data?.documentClass || 'article'
    );

    let forcedStyle = null;
    if (docClass === 'IEEEtran') forcedStyle = 'ieeetran';
    if (docClass === 'acmart') forcedStyle = 'acm';

    const isLocked = !!forcedStyle;
    const currentStyle = isLocked ? forcedStyle : (data.style || 'plain');

    const handleChange = (field, value) => {
        updateNodeData(id, { [field]: value });
    };

    return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-500 rounded-xl p-4 shadow-2xl min-w-[300px] text-white hover:border-slate-400 transition-all flex flex-col">

            <div className="border-b border-slate-500/30 pb-2 mb-3 flex justify-between items-center bg-slate-800/50 -mx-4 -mt-4 px-4 py-3 rounded-t-xl">
                <span className="font-bold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Bibliography
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => useStore.getState().deleteNode(id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Delete Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500/70 tracking-tight mb-1 flex justify-between">
                        <span>Style</span>
                        {isLocked && (
                            <span className="text-amber-400 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Locked by Template
                            </span>
                        )}
                    </label>
                    <select
                        className={`nodrag w-full bg-slate-950/50 border border-slate-500/30 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-400 transition-colors cursor-pointer ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        value={currentStyle}
                        onChange={(e) => handleChange('style', e.target.value)}
                        disabled={isLocked}
                    >
                        <option value="plain">Plain ([1])</option>
                        <option value="alpha">Alpha ([Knu66])</option>
                        <option value="acm">ACM</option>
                        <option value="ieeetran">IEEE</option>
                        <option value="unsrt">Unsorted</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500/70 tracking-tight flex justify-between">
                        <span>BibTeX Content</span>
                        <span className="text-slate-600 font-normal normal-case">Paste .bib file here</span>
                    </label>
                    <textarea
                        className="nodrag w-full h-48 bg-slate-950/50 border border-slate-500/30 rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-400 transition-all resize-y placeholder-slate-700/50"
                        placeholder={`@article{knuth1984,
                            title={Literate programming},
                            author={Knuth, Donald E},
                            journal={The Computer Journal},
                            year={1984}
                            }`}
                        value={data.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default BibNode;
