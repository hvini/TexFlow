import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useStore = create((set, get) => ({
    nodes: [
        {
            id: 'root-1',
            type: 'rootNode',
            position: { x: 250, y: 5 },
            data: { documentClass: 'article' },
        },
    ],
    edges: [],

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection) => {
        set({
            edges: addEdge({ ...connection, type: 'deletableEdge' }, get().edges),
        });
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
        });
    },
    deleteNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        });
    },
    deleteEdge: (edgeId) => {
        set({
            edges: get().edges.filter((edge) => edge.id !== edgeId),
        });
    },
    deleteSelection: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter((n) => n.selected && n.type !== 'rootNode');
        const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
        const selectedEdgeIds = new Set(edges.filter((e) => e.selected).map((e) => e.id));

        set({
            nodes: nodes.filter((n) => !selectedNodeIds.has(n.id)),
            edges: edges.filter((e) =>
                !selectedEdgeIds.has(e.id) &&
                !selectedNodeIds.has(e.source) &&
                !selectedNodeIds.has(e.target)
            ),
        });
    },
    duplicateNode: (nodeId) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        if (node) {
            const newNode = {
                ...JSON.parse(JSON.stringify(node)),
                id: `${node.type}-${Date.now()}`,
                position: {
                    x: node.position.x + 20,
                    y: node.position.y + 20,
                },
                selected: false,
            };
            set({
                nodes: [...get().nodes, newNode],
            });
        }
    },
    duplicateSelection: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter((n) => n.selected && n.type !== 'rootNode');

        if (selectedNodes.length === 0) return;

        const timestamp = Date.now();
        const idMap = {};

        // 1. Clone Nodes
        const newNodes = selectedNodes.map((node) => {
            const newId = `${node.type}-${timestamp}-${Math.random().toString(36).substr(2, 5)}`;
            idMap[node.id] = newId;
            return {
                ...JSON.parse(JSON.stringify(node)),
                id: newId,
                position: {
                    x: node.position.x + 40,
                    y: node.position.y + 40,
                },
                selected: true,
            };
        });

        // 2. Clone Edges between selected nodes
        const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
        const newEdges = edges
            .filter((edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target))
            .map((edge) => ({
                ...edge,
                id: `edge-${timestamp}-${Math.random().toString(36).substr(2, 5)}`,
                source: idMap[edge.source],
                target: idMap[edge.target],
                selected: true,
            }));

        // 3. Update State (Deselect old, select new)
        set({
            nodes: [
                ...nodes.map((n) => ({ ...n, selected: false })),
                ...newNodes,
            ],
            edges: [
                ...edges.map((e) => ({ ...e, selected: false })),
                ...newEdges,
            ],
        });
    },
    updateNodeData: (nodeId, newData) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }
                return node;
            }),
        });
    },
}));

export default useStore;
