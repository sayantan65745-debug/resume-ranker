import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const extractText = async (filePath, fileType) => {
  if (fileType === "application/pdf") {
    const data = await pdfParse(fs.readFileSync(filePath));
    return normalize(data.text);
  }
  const result = await mammoth.extractRawText({ path: filePath });
  return normalize(result.value);
};

export const normalize = (text) =>
  text.toLowerCase().replace(/[^\w\s+#]/g, " ").replace(/\s+/g, " ").trim();