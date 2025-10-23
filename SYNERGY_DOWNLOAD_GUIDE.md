# Synergy Trak - Download Tray Lists Guide

## Discovery
When clicking on a tray name, there's an "Actions" dropdown with:
- **Show traylist** (PDF)
- **Download tray list** (PDF)
- **Email tray list**

## Approach Options

### Option 1: Manual Download (Recommended for Testing)
1. Click on a tray name
2. Click "Actions" dropdown
3. Click "Download tray list"
4. Save PDF
5. Extract data from PDF using a PDF parser

### Option 2: Automated Download Script
Create a script that:
1. Clicks each tray
2. Clicks "Actions" → "Download tray list"
3. Downloads all PDFs (browser will save to Downloads folder)
4. Process PDFs later with a batch PDF parser

### Option 3: Use API Directly
The download button likely calls an API endpoint. We could:
1. Inspect network traffic when clicking "Download"
2. Find the API endpoint
3. Loop through all tray IDs and download directly

## Next Steps

### Test Download
1. Click on ONE tray
2. Download the tray list PDF
3. Check if the PDF has the full instrument checklist
4. Send the PDF to analyze structure

### If PDF has all data
We can create a script to:
- Click through all 10,865 trays
- Download each PDF automatically
- Then parse all PDFs in batch using Node.js PDF library

This would be MUCH faster and more reliable than web scraping!

## PDF Parsing Libraries (for later)
- `pdf-parse` - Extract text from PDFs
- `pdfjs-dist` - Mozilla's PDF.js library
- `pdf2json` - Convert PDF to JSON

## Estimated Time
- Download all PDFs: ~30-60 minutes (automatic script)
- Parse all PDFs: ~5-10 minutes (Node.js batch script)
- **Total: ~1 hour** (vs 3-4 hours with manual clicking)
