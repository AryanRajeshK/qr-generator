"use client";

import QRCode from "qrcode";
import { useState } from "react";

export default function Home() {
  // State variables
  const [link, setLink] = useState('');
  const [src, setSrc] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to generate QR code
  const generate = () => {
    QRCode.toDataURL(link)
      .then(dataUrl => {
        setSrc(dataUrl);
        setDownloadUrl(dataUrl);
      })
      .catch(err => {
        console.error('Error generating QR code:', err);
        setError(`Can't create an empty QR code :(`);
      });

    setError(''); // Clear any previous error
  };

  // Function to download QR code
  const downloadQRCode = (fileType: string) => {
    let cleanedLink = link.replace(/^(https?:\/\/)?/, '');
    const websiteName = cleanedLink.split('/')[0]; // Assuming link format is "website.com"
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `${websiteName}_qr.${fileType}`;
    anchor.click();
    setShowDropdown(false);
  };

  // Handle direct download in PNG format
  const handleDirectDownload = () => {
    downloadQRCode('png');
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
        placeholder="Enter something ..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      {error && <p className="text-red-500 font-mono text-xs mt-2">{error}</p>}

      <button
        type="button"
        onClick={generate}
        className="bg-white shadow-xl text-black mt-5 w-[100px] h-[30px] rounded-md font-mono hover:bg-green-500 hover:text-white transition-all"
      >
        Generate
      </button>

      {downloadUrl && (
        <div className="relative mt-4 flex flex-col items-center">
          <div className="flex">
            <button
              type="button"
              onClick={handleDirectDownload}
              className="bg-blue-500 text-white w-[90px] h-[30px] rounded-l-md font-mono hover:bg-blue-700 transition-all outline"
            >
              Download
              
            </button>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-blue-500 text-white w-[20px] h-[30px] rounded-r-md font-mono hover:bg-blue-700 outline"
            >
              <p className={`text-[15px] transition-all transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`}>
                ▼
              </p>
            </button>
          </div>

          {showDropdown && (
            <div className="absolute bg-white shadow-lg rounded-md mb-2 w-[100px] border-2 border-gray-400 bottom-[40px]">
              <button
                type="button"
                onClick={() => downloadQRCode('png')}
                className="block px-4 py-2 hover:bg-gray-200 w-full text-center"
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => downloadQRCode('jpg')}
                className="block px-4 py-2 hover:bg-gray-200 w-full text-center"
              >
                JPG
              </button>
              <button
                type="button"
                onClick={() => downloadQRCode('jpeg')}
                className="block px-4 py-2 hover:bg-gray-200 w-full text-center"
              >
                JPEG
              </button>
              <button
                type="button"
                onClick={() => downloadQRCode('tiff')}
                className="block px-4 py-2 hover:bg-gray-200 w-full text-center"
              >
                TIFF
              </button>
            </div>
          )}
        </div>
      )}

      <a
        href="https://github.com/AryanRajeshK"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-black absolute bottom-0 right-2 mb-2 font-mono hover:underline transition-all flex items-center opacity-60"
      >
        <img src="git.png" alt="git" className="w-4 h-4 mr-2" />
      </a>
    </main>
  );
}