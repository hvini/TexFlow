export const generateLatex = (nodes, edges) => {
    const root = nodes.find((n) => n.type === 'rootNode');
    if (!root) return { code: '% No Root Node found\n% Please add a Root Node to start.', images: [] };

    let images = [];
    const visited = new Set();

    // Find Bibliography Node
    const bibNode = nodes.find(n => n.type === 'bibNode');

    let latex = `\\documentclass{${root.data.documentClass || 'article'}}\n`;
    latex += `\\usepackage{graphicx}\n`;

    // Inject Bib content if exists
    if (bibNode && bibNode.data.content) {
        latex += `\\begin{filecontents*}{references.bib}\n${bibNode.data.content}\n\\end{filecontents*}\n`;
    }

    latex += `\\begin{document}\n\n`;

    const getChildren = (parentId) => {
        return edges
            .filter((e) => e.source === parentId)
            .map((e) => nodes.find((n) => n.id === e.target))
            .filter(Boolean)
            .sort((a, b) => a.position.y - b.position.y);
    };

    const traverse = (node) => {
        if (!node || visited.has(node.id)) return '';
        visited.add(node.id);

        let content = '';
        if (node.type === 'sectionNode') {
            content += `\\section*{${node.data.title || 'Untitled'}}\n`;
        } else if (node.type === 'contentNode') {
            content += `${node.data.content || ''}\n\n`;
        } else if (node.type === 'imageNode') {
            const ext = node.data.fileName?.split('.').pop() || 'jpg';
            const imgName = `img_${node.id.replace(/[^a-zA-Z0-9]/g, '')}.${ext}`;
            if (node.data.url) {
                images.push({ name: imgName, url: node.data.url });
                const width = node.data.width || '0.8';
                const alignMap = { left: '\\raggedright', center: '\\centering', right: '\\raggedleft' };
                const align = alignMap[node.data.align] || '\\centering';
                const floatFlag = node.data.floatFlag || 'h!';
                const rotation = node.data.rotation || '0';
                const latexAngle = rotation === '0' ? '0' : `-${rotation}`;

                content += `\\begin{figure}[${floatFlag}]\n  ${align}\n  \\includegraphics[width=${width}\\textwidth, angle=${latexAngle}, origin=c]{${imgName}}\n\\end{figure}\n\n`;
            }
        }

        const children = getChildren(node.id);
        children.forEach((child) => {
            content += traverse(child);
        });
        return content;
    };

    const rootChildren = getChildren(root.id);
    let bodyContent = '';

    rootChildren.forEach((child) => {
        bodyContent += traverse(child);
    });

    if (!bodyContent.trim()) {
        latex += 'Hello World (Fallback Content)\n';
    } else {
        latex += bodyContent;
    }

    // Append Bibliography
    if (bibNode) {
        latex += `\n\\bibliographystyle{${bibNode.data.style || 'plain'}}\n`;
        latex += `\\bibliography{references}\n`;
    }

    latex += `\\end{document}`;
    return { code: latex, images };
};



