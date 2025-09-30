import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pdfjsLib;
import fs from 'fs';

export const toPgVector = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Embedding harus berupa array angka");
    }
    return `[${arr.join(",")}]`;
}

export const loadPdfText = async (filePath) => {
    const pdfBuffer = fs.readFileSync(filePath);

    const pdfData = new Uint8Array(pdfBuffer);

    const pdf = await getDocument({ data: pdfData }).promise;
    
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
    }
    return text;
}

export const simmilarity = (vecA, vecB) => {
  const a = Array.isArray(vecA) ? vecA : JSON.parse(vecA);
  const b = Array.isArray(vecB) ? vecB : JSON.parse(vecB);

  if (a.length !== b.length) return 0;

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (normA === 0 || normB === 0) return 0;

  return dot / (normA * normB);
};