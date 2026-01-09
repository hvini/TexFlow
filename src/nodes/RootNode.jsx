import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

const RootNode = ({ id, data }) => {
    const updateNodeData = useStore((state) => state.updateNodeData);

    return (
        <div className="bg-indigo-900/90 backdrop-blur-xl border border-indigo-500 rounded-xl p-4 shadow-2xl min-w-[220px] text-white transition-all hover:border-indigo-400">
            <div className="border-b border-indigo-500/30 pb-2 mb-3">
                <span className="font-bold text-sm uppercase tracking-wider text-indigo-300">Root Node</span>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs text-indigo-300 font-medium">Document Class</label>
                <select
                    className="nodrag w-full bg-indigo-950/50 border border-indigo-500/50 rounded-md px-3 py-2 text-sm text-indigo-100 focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer"
                    value={data.documentClass || 'article'}
                    onChange={(evt) => updateNodeData(id, { documentClass: evt.target.value })}
                >
                    <option value="article">Article</option>
                    <option value="report">Report</option>
                    <option value="book">Book</option>
                </select>
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
