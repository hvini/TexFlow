import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import useStore from '../store';

const ContentNode = ({ id, data, selected }) => {
    const updateNodeData = useStore((state) => state.updateNodeData);

    return (
        <div className="bg-emerald-900/90 backdrop-blur-xl border border-emerald-500 rounded-xl p-4 shadow-2xl min-w-[280px] min-h-[150px] text-white hover:border-emerald-400 transition-all flex flex-col h-full">
            <NodeResizer
                color="#10b981"
                isVisible={selected}
                minWidth={280}
                minHeight={150}
            />

            <Handle
                type="target"
                position={Position.Top}
                className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-emerald-900"
            />

            <div className="border-b border-emerald-500/30 pb-2 mb-3 flex justify-between items-center group/header shrink-0">
                <span className="font-bold text-sm uppercase tracking-wider text-emerald-300">Content</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => useStore.getState().duplicateNode(id)}
                        className="text-emerald-500 hover:text-emerald-300 transition-colors p-1"
                        title="Duplicate Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                    </button>
                    <button
                        onClick={() => useStore.getState().deleteNode(id)}
                        className="text-emerald-500 hover:text-red-400 transition-colors p-1"
                        title="Delete Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 min-h-0">
                <textarea
                    className="nodrag w-full flex-1 bg-emerald-950/50 border border-emerald-500/50 rounded-md px-3 py-2 text-sm text-emerald-100 focus:outline-none focus:border-emerald-400 transition-colors placeholder-emerald-700 resize-none"
                    placeholder="Write your LaTeX content here..."
                    value={data.content || ''}
                    onChange={(evt) => updateNodeData(id, { content: evt.target.value })}
                />
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-emerald-900"
            />
        </div>
    );
};


export default ContentNode;
