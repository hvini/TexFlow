import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

const RootNode = ({ id, data }) => {
    const updateNodeData = useStore((state) => state.updateNodeData);
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const handleTemplateChange = (template) => {
        let updates = { template };
        if (template === 'ieee_conf') {
            updates.documentClass = 'IEEEtran';
            updates.preamble = '% IEEE Conference Preamble\n% Class options are set in root node (conf default)\n\\usepackage{cite}\n\\usepackage{amsmath,amssymb,amsfonts}';
        } else if (template === 'acm') {
            updates.documentClass = 'acmart';
            updates.preamble = '% ACM Preamble\n\\usepackage{booktabs} % For formal tables\n% \\acmConference[Conference]{Name}{Date}{Venue}';
        } else if (template === 'article') {
            updates.documentClass = 'article';
            updates.preamble = '';
        }
        updateNodeData(id, updates);
    };

    return (
        <div className="bg-indigo-900/90 backdrop-blur-xl border border-indigo-500 rounded-xl p-4 shadow-2xl min-w-[280px] text-white transition-all hover:border-indigo-400">
            <div className="border-b border-indigo-500/30 pb-2 mb-3 flex justify-between items-center">
                <span className="font-bold text-sm uppercase tracking-wider text-indigo-300">Document Settings</span>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${showAdvanced ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-indigo-500/50 text-indigo-400 hover:text-indigo-200'}`}
                >
                    {showAdvanced ? 'Simple' : 'Advanced'}
                </button>
            </div>

            <div className="flex flex-col gap-3">

                {/* Templates Selector */}
                <div>
                    <label className="text-[10px] uppercase font-bold text-indigo-300/70 tracking-tight mb-1 block">Template</label>
                    <select
                        className="nodrag w-full bg-indigo-950/50 border border-indigo-500/50 rounded px-2 py-1.5 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400 cursor-pointer"
                        value={data.template || 'article'}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                        <option value="article">Standard Article</option>
                        <option value="ieee_conf">IEEE Conference</option>
                        <option value="acm">ACM Primary</option>
                    </select>
                </div>

                {/* Top Matter Inputs */}
                <div className="space-y-3 pt-2 border-t border-indigo-500/30">
                    {/* Title */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-indigo-300/70 tracking-tight mb-1 block">Title</label>
                        <input
                            className="nodrag w-full bg-indigo-950/50 border border-indigo-500/50 rounded px-2 py-1.5 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400"
                            value={data.title || ''}
                            onChange={(e) => updateNodeData(id, { title: e.target.value })}
                            placeholder="My Great Paper"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-indigo-300/70 tracking-tight mb-1 block">Author(s)</label>
                        <input
                            className="nodrag w-full bg-indigo-950/50 border border-indigo-500/50 rounded px-2 py-1.5 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400"
                            value={data.author || ''}
                            onChange={(e) => updateNodeData(id, { author: e.target.value })}
                            placeholder="A. Gent"
                        />
                    </div>

                    {/* Abstract */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-indigo-300/70 tracking-tight mb-1 block">Abstract</label>
                        <textarea
                            className="nodrag w-full h-20 bg-indigo-950/50 border border-indigo-500/50 rounded px-2 py-1.5 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400 resize-y"
                            value={data.abstract || ''}
                            onChange={(e) => updateNodeData(id, { abstract: e.target.value })}
                            placeholder="Abstract text..."
                        />
                    </div>
                </div>

                {/* Document Class (Editable) */}
                <div>
                    <label className="text-[10px] uppercase font-bold text-indigo-300/70 tracking-tight mb-1 block">Class</label>
                    <input
                        className="nodrag w-full bg-indigo-950/50 border border-indigo-500/50 rounded px-2 py-1.5 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400 font-mono"
                        value={data.documentClass || 'article'}
                        onChange={(e) => updateNodeData(id, { documentClass: e.target.value })}
                        placeholder="article"
                    />
                </div>

                {/* Advanced Preamble */}
                {showAdvanced && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="text-[10px] uppercase font-bold text-indigo-300/70 tracking-tight mb-1 flex justify-between">
                            <span>Preamble</span>
                            <span className="text-indigo-400/50 font-normal normal-case">Packages & Macros</span>
                        </label>
                        <textarea
                            className="nodrag w-full h-32 bg-indigo-950/50 border border-indigo-500/50 rounded px-2 py-1.5 text-xs text-indigo-100 focus:outline-none focus:border-indigo-400 font-mono resize-y"
                            value={data.preamble || ''}
                            onChange={(e) => updateNodeData(id, { preamble: e.target.value })}
                            placeholder="\usepackage{geometry}..."
                            spellCheck={false}
                        />
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-indigo-900"
            />
        </div>
    );
};

export default RootNode;
