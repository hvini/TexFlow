import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

const SectionNode = ({ id, data }) => {
    const updateNodeData = useStore((state) => state.updateNodeData);

    return (
        <div className="bg-cyan-900/90 backdrop-blur-xl border border-cyan-500 rounded-xl p-4 shadow-2xl min-w-[220px] text-white hover:border-cyan-400 transition-all">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-cyan-400 !w-3 !h-3 !border-2 !border-cyan-900"
            />

            <div className="border-b border-cyan-500/30 pb-2 mb-3 flex justify-between items-center group/header">
                <span className="font-bold text-sm uppercase tracking-wider text-cyan-300">Section</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => useStore.getState().duplicateNode(id)}
                        className="text-cyan-500 hover:text-cyan-300 transition-colors p-1"
                        title="Duplicate Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                    </button>
                    <button
                        onClick={() => useStore.getState().deleteNode(id)}
                        className="text-cyan-500 hover:text-red-400 transition-colors p-1"
                        title="Delete Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs text-cyan-300 font-medium">Title</label>
                <input
                    type="text"
                    className="nodrag w-full bg-cyan-950/50 border border-cyan-500/50 rounded-md px-3 py-2 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors placeholder-cyan-700"
                    placeholder="e.g. Introduction"
                    value={data.title || ''}
                    onChange={(evt) => updateNodeData(id, { title: evt.target.value })}
                />
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-cyan-400 !w-3 !h-3 !border-2 !border-cyan-900"
            />
        </div>
    );
};

export default SectionNode;
