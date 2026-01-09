import React from 'react';
import { Handle, Position } from 'reactflow';
import useStore from '../store';

const ImageNode = ({ id, data }) => {
    const updateNodeData = useStore((state) => state.updateNodeData);

    const handleChange = (field, value) => {
        updateNodeData(id, { [field]: value });
    };

    return (
        <div className="bg-amber-900/90 backdrop-blur-xl border border-amber-500 rounded-xl p-4 shadow-2xl min-w-[240px] text-white hover:border-amber-400 transition-all flex flex-col">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-amber-400 !w-3 !h-3 !border-2 !border-amber-900"
            />

            <div className="border-b border-amber-500/30 pb-2 mb-3 flex justify-between items-center group/header shrink-0">
                <span className="font-bold text-sm uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => useStore.getState().duplicateNode(id)}
                        className="text-amber-500 hover:text-amber-300 transition-colors p-1"
                        title="Duplicate Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                    </button>
                    <button
                        onClick={() => useStore.getState().deleteNode(id)}
                        className="text-amber-500 hover:text-red-400 transition-colors p-1"
                        title="Delete Node"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-amber-500/70 tracking-tight">Upload Image</label>
                    <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer bg-amber-950/50 border border-amber-500/30 rounded px-3 py-2 text-xs text-amber-100 hover:border-amber-400 hover:bg-amber-950/80 transition-all flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {data.fileName || 'Choose File...'}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (readerEvent) => {
                                            const img = new Image();
                                            img.onload = () => {
                                                // Create a canvas to "bake" the normal orientation
                                                const canvas = document.createElement('canvas');
                                                canvas.width = img.width;
                                                canvas.height = img.height;
                                                const ctx = canvas.getContext('2d');
                                                // Modern browsers' drawImage handles EXIF orientation automatically
                                                ctx.drawImage(img, 0, 0);

                                                updateNodeData(id, {
                                                    url: canvas.toDataURL('image/jpeg', 0.9),
                                                    fileName: file.name,
                                                    rotation: '0' // Reset rotation for new image
                                                });
                                            };
                                            img.src = readerEvent.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-amber-500/70 tracking-tight">Width (%)</label>
                        <input
                            type="text"
                            className="nodrag bg-amber-950/50 border border-amber-500/30 rounded px-2 py-1.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-all"
                            placeholder="0.8"
                            value={data.width || '0.8'}
                            onChange={(e) => handleChange('width', e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-amber-500/70 tracking-tight">Align</label>
                        <select
                            className="nodrag bg-amber-950/50 border border-amber-500/30 rounded px-2 py-1.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
                            value={data.align || 'center'}
                            onChange={(e) => handleChange('align', e.target.value)}
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-amber-500/70 tracking-tight">Float Flag</label>
                        <input
                            type="text"
                            className="nodrag bg-amber-950/50 border border-amber-500/30 rounded px-2 py-1.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-all"
                            placeholder="h!"
                            value={data.floatFlag ?? ''}
                            onChange={(e) => handleChange('floatFlag', e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-amber-500/70 tracking-tight">Rotate</label>
                        <select
                            className="nodrag bg-amber-950/50 border border-amber-500/30 rounded px-2 py-1.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
                            value={data.rotation || '0'}
                            onChange={(e) => handleChange('rotation', e.target.value)}
                        >
                            <option value="0">0°</option>
                            <option value="90">90°</option>
                            <option value="180">180°</option>
                            <option value="270">270°</option>
                        </select>
                    </div>
                </div>

                {data.url && (
                    <div className="mt-2 rounded border border-amber-500/20 bg-black/20 overflow-hidden flex items-center justify-center p-4 h-[200px] relative">
                        <img
                            src={data.url}
                            alt="Preview"
                            className="absolute transition-transform duration-300 shadow-lg rounded-sm"
                            style={{
                                transform: `rotate(${data.rotation || 0}deg)`,
                                maxWidth: (data.rotation === '90' || data.rotation === '270') ? '160px' : '100%',
                                maxHeight: (data.rotation === '90' || data.rotation === '270') ? '100%' : '160px',
                                objectFit: 'contain'
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-amber-400 !w-3 !h-3 !border-2 !border-amber-900"
            />
        </div>
    );
};

export default ImageNode;
