import React from 'react';
import { getBezierPath, EdgeLabelRenderer } from 'reactflow';
import useStore from '../store';

export default function DeletableEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) {
    const deleteEdge = useStore((state) => state.deleteEdge);
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetPosition,
        targetX,
        targetY,
    });

    const onEdgeClick = (evt) => {
        evt.stopPropagation();
        deleteEdge(id);
    };

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path stroke-gray-500 stroke-2 hover:stroke-red-500 transition-colors cursor-pointer"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <button
                        className="w-5 h-5 bg-gray-800 border border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-500 rounded-full flex items-center justify-center transition-all bg-white/10 backdrop-blur-sm shadow-xl"
                        onClick={onEdgeClick}
                        title="Remove connection"
                    >
                        ×
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
