/**
 * Utility to test PDF download functionality
 * This helps debug issues with file serving and download
 */
export const testPDFAccess = async () => {
    try {
        const response = await fetch('/Mohamed_Mahmoud_CV.pdf', {
            method: 'HEAD', // Just check headers, don't download the full file
        });
        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
            };
        }
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        return {
            success: true,
            fileInfo: {
                size: contentLength ? parseInt(contentLength, 10) : 0,
                type: contentType || 'unknown',
                isValidPDF: contentType?.includes('pdf') || contentType?.includes('application/pdf') || false,
            },
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
export const validatePDFContent = async () => {
    try {
        const response = await fetch('/Mohamed_Mahmoud_CV.pdf');
        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
            };
        }
        const blob = await response.blob();
        // Basic PDF validation - check if it starts with PDF signature
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        // PDF files start with "%PDF"
        const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
        const isValidPDF = pdfSignature.every((byte, index) => uint8Array[index] === byte);
        return {
            success: true,
            isValidPDF,
            size: blob.size,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
