function generateLLMPrompt() {
  return `Hi LLM! I used a browser extension to obfuscate a file into multiple segments using Base64 encoding and a fixed character shift.

I've uploaded a ZIP file containing:
- \`README.txt\` — contains the original filename, character shift value, and the number of segments
- \`part_0\` to \`part_N\` — the obfuscated segments

Please:
1. Read the \`README.txt\` to get the original filename, character shift value, and number of parts
2. Concatenate all \`part_*\` files in order
3. Reverse the character shift using the shift value
4. Base64-decode the result
5. Save it using the original filename
6. Show me a preview if it's a text-based file (like \`.txt\`, \`.py\`, etc.)

Thanks!`;
}

// Core logic for the file obfuscator extension
document.getElementById("processBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const shiftValue = parseInt(document.getElementById("shiftInput").value);
  const numSegments = parseInt(document.getElementById("segmentsInput").value);
  const status = document.getElementById("status");

  if (!fileInput.files.length) {
    status.textContent = "Please select a file.";
    return;
  }
  if (isNaN(shiftValue) || shiftValue < 0 || shiftValue > 255) {
    status.textContent = "Invalid shift value.";
    return;
  }
  if (isNaN(numSegments) || numSegments < 1 || numSegments > 10) {
    status.textContent = "Segment count must be 1–10.";
    return;
  }

  const file = fileInput.files[0];
  const originalName = file.name;
  const base64Data = await readFileAsBase64(file);

  const obfuscated = shiftObfuscate(base64Data, shiftValue);
  const segments = splitIntoSegments(obfuscated, numSegments);

  const zip = new JSZip();
  segments.forEach((segment, i) => {
    zip.file(`part_${i}`, segment);
  });

  const readme = generateReadme(originalName, shiftValue, numSegments);
  const llmPrompt = generateLLMPrompt();
  zip.file("README.txt", readme);
  zip.file("LLM_instructions.txt", llmPrompt);

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${originalName.split(".")[0]}_20250409_010842_obfuscated.zip`);
  status.textContent = "✅ ZIP downloaded!";
});

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = btoa(
        new Uint8Array(reader.result)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function shiftObfuscate(data, shift) {
  return Array.from(data).map(char => String.fromCharCode((char.charCodeAt(0) + shift) % 256)).join('');
}

function splitIntoSegments(text, count) {
  const segSize = Math.ceil(text.length / count);
  const segments = [];
  for (let i = 0; i < count; i++) {
    segments.push(text.slice(i * segSize, (i + 1) * segSize));
  }
  return segments;
}

function generateReadme(originalFilename, shiftValue, numSegments) {
  let content = "== File Upload Bypass - Reconstruction Guide ==\n\n";
  content += `Original Filename: ${originalFilename}\n`;
  content += `Character Shift Value: ${shiftValue}\n`;
  content += `Segment Count: ${numSegments}\n`;
  content += `Segments:\n`;
  for (let i = 0; i < numSegments; i++) {
    content += `  - part_${i}\n`;
  }
  content += "\nTo reconstruct:\n";
  content += "1. Concatenate all segments in order.\n";
  content += "2. Shift characters back by the value above.\n";
  content += "3. Base64 decode and save as the original file.\n";
  return content;
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}



document.getElementById("copyPromptBtn").addEventListener("click", () => {
  const prompt = generateLLMPrompt();
  navigator.clipboard.writeText(prompt).then(() => {
    const status = document.getElementById("status");
    status.textContent = "📋 LLM prompt copied to clipboard!";
    setTimeout(() => status.textContent = "", 2000);
  });
});
