// Simple test to check if the PDF is properly served
const http = require('http');
const fs = require('fs');
const path = require('path');

// Check if the PDF file exists
const pdfPath = path.join(__dirname, 'public', 'Mohamed_Mahmoud_CV.pdf');
const pdfExists = fs.existsSync(pdfPath);

console.log('PDF file exists:', pdfExists);

if (pdfExists) {
  const stats = fs.statSync(pdfPath);
  console.log('PDF file size:', stats.size, 'bytes');
  
  // Read first few bytes to check PDF signature
  const fd = fs.openSync(pdfPath, 'r');
  const buffer = Buffer.alloc(4);
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);
  
  const pdfSignature = buffer.toString('ascii');
  console.log('PDF signature:', pdfSignature);
  console.log('Is valid PDF:', pdfSignature === '%PDF');
} else {
  console.error('PDF file not found at:', pdfPath);
}