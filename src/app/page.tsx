"use client"

import QRCode from "qrcode";

import { useState } from "react";

export default function Home() {
  
  const [link, setLink] = useState<string>('');
  
  const [src, setSrc] = useState<string>('');
  
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  
  const [error, setError] = useState<string>('');

  const generate = () => {
    if (!link.trim() || !link.includes('.')) {
      setError('Please enter a valid link');
      return;
    }
    setError(''); // Clear any previous error

    QRCode.toDataURL(link).then(dataUrl => {
      setSrc(dataUrl);
      setDownloadUrl(dataUrl);
    }).catch(err => {
      console.error('Error generating QR code:', err);
    });
  };

  const downloadQRCode = () => {
    // Remove 'https://' or 'http://' from the beginning of the link
    let cleanedLink = link.replace(/^(https?:\/\/)?/, '');
    // Extract website name from cleaned link
    const websiteName = cleanedLink.split('/')[0]; // Assuming link format is "website/u6347.com"
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `${websiteName}_arkcode.png`;
    anchor.click();
  };

  return (
    <main className="flex flex-col items-center justify-between">
      
      <title>QR-Code Generator</title>
      
      <link rel="icon" href="/favicon.ico" />
      
      <div className="w-full h-[60px] items-center">
      
        <p className="text-black underline text-[30px] font-mono mt-4 text-center">
          QR Code Generator
        </p>
        
      </div>
      
      <img className="rounded-[20px] mt-5 w-60 border-black shadow-xl" src={src} alt="" />
      
      <input
        className="mt-5 border shadow-xl font-mono text-zinc-700 w-[300px] h-[40px] rounded-md pl-2 pr-2 placeholder:pl-1"
        type="text"
        placeholder="Add link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      
      {error && <p className="text-red-500 font-mono text-xs mt-2">{error}</p>}

      <button type="button" onClick={generate} className="bg-white shadow-xl text-black mt-5 w-[100px] h-[30px] rounded-md font-mono hover:bg-green-500 hover:text-white transition-all">
        Generate
      </button>
      
      {downloadUrl && (
        <button type="button" onClick={downloadQRCode} className="bg-blue-500 text-white mt-2 w-[100px] h-[30px] rounded-md font-mono hover:bg-blue-700 transition-all absolute bottom-0 mb-3 left-3">
          Download
        </button>
      )}

      <a href="https://github.com/AryanRajeshK" target="_blank" rel="noopener noreferrer" className="text-xs text-black absolute bottom-0 right-5 mb-4 font-mono hover:underline transition-all">
       By Aryan Rajeshkumar
      </a>
    
    </main>
  
  );

}
