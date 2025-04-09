# Bypass File Upload Type Restriction — Browser Extension

This is a browser extension that lets you **obfuscate any file** (e.g., `.py`, `.zip`, `.mp4`) using **Base64 encoding** and a **fixed character shift**, then splits the result into multiple parts for safe upload. It also includes a prompt to help LLMs (like ChatGPT) reconstruct the original file. This should help you bypass file-type-based upload restrictions to AI platforms placed by your IT.

---

## Features

- Drag-and-drop or select any file
- Obfuscate with a character shift (0–255)
- Choose how many segments to split the file into (1–10)
- Generates `README.txt` with decoding instructions
- Includes `LLM_instructions.txt` for easy use with ChatGPT or other LLMs
- Copy-to-clipboard prompt button
- Automatically names ZIP: `filename_YYYYMMDD_HHMMSS_obfuscated.zip`

---

## Output ZIP Contents

- `README.txt`: Explains how to reconstruct the file
- `LLM_instructions.txt`: Prompt you can send to ChatGPT to reconstruct it
- `part_0`, `part_1`, ..., `part_N`: Obfuscated segments

---

## How to Use

1. Clone this repo or download the ZIP and unzip it.
2. Go to `edge://extensions` or `chrome://extensions`
3. Enable **Developer Mode**
4. Click **“Load unpacked”** and select the project folder.
5. Click the extension icon to open the popup.
6. Choose a file, shift value, and number of segments.
7. Click **Obfuscate + Download ZIP**
8. (Optional) Click **Copy LLM Prompt** to use in ChatGPT!

---

## Example Prompt for LLMs

Saved as `LLM_instructions.txt` in the ZIP:

```
Hi LLM! I used a browser extension to obfuscate a file into multiple segments using Base64 encoding and a fixed character shift.

I've uploaded a ZIP file containing:
- `README.txt` — contains the original filename, character shift value, and the number of segments
- `part_0` to `part_N` — the obfuscated segments

Please:
1. Read the `README.txt` to get the original filename, character shift value, and number of parts
2. Concatenate all `part_*` files in order
3. Reverse the character shift using the shift value
4. Base64-decode the result
5. Save it using the original filename
6. Show me a preview if it's a text-based file (like `.txt`, `.py`, etc.)

Thanks!
```

---

## 🔧 Built With

- HTML + JavaScript
- [JSZip](https://stuk.github.io/jszip/) for ZIP packaging
- `FileReader`, `Blob`, `navigator.clipboard` APIs

---

## 📁 Folder Structure

```
📦 extension/
├── popup.html
├── popup.js
├── jszip.min.js
├── icon.png
└── manifest.json
```

---

## 🪪 License

[MIT](LICENSE)

---

## 🙌 Contributing

Ideas, issues, and PRs welcome!

---

## ✨ Author

Made with ❤️ by [@rz74](https://github.com/rz74)
