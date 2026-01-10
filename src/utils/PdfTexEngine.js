export class PdfTexEngine {
    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    }

    async compile(latexCode, images = [], timeout = 30) {
        console.log('Compiling via server:', this.apiUrl);

        try {
            const response = await fetch(`${this.apiUrl}/compile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latex: latexCode,
                    images: images,
                    timeout: timeout
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.logs || errorData.error || `Server error: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            // Get the PDF blob
            const blob = await response.blob();
            return URL.createObjectURL(blob);

        } catch (err) {
            console.error('Compilation failed:', err);
            throw err;
        }
    }
}

export const pdfTex = new PdfTexEngine();