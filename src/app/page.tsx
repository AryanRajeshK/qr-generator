"use client";

import QRCode from "qrcode";
import { useRef, useState } from "react";

export default function Home() {
  // State variables
  const [link, setLink] = useState("");
  const [src, setSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  // Color for QR code
  const [color, setColor] = useState("#000000");

  // For logo image
  const [logoSrc, setLogoSrc] = useState("");

  // Ref to the hidden canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // A constant for how large you want your final canvas to be
  // Increase to 4096, 8192, etc., if you want an even higher-resolution output
  const CANVAS_SIZE = 2048;

  // Handle changes to the logo file input
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Function to generate a high-resolution QR code as PNG
  // by first generating an SVG (vector) and then drawing it onto
  // a large canvas to eliminate pixelation.
  const generateQRCode = async () => {
    if (!link) {
      setError(`Can't create an empty QR code :(`);
      return;
    }

    if (!canvasRef.current) return;

    setError(""); // Clear any previous error

    try {
      // 1. Generate an SVG string (vector) from the `qrcode` package
      const qrSvg = await QRCode.toString(link, {
        type: "svg",
        errorCorrectionLevel: "H",
        color: {
          dark: color,
          light: "#ffffff",
        },
        margin: 2,
      });

      // 2. Convert that SVG string to a data URL for an <img> source
      const svgBase64 = `data:image/svg+xml;base64,${btoa(qrSvg)}`;

      // 3. Now draw that <img> (vector-based) onto a large canvas
      const qrImg = new Image();
      qrImg.src = svgBase64;
      qrImg.onload = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Make the canvas large for a high-res final image
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        // Draw the vector-based QR code at full size
        ctx.drawImage(qrImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 4. If there's a logo, embed it with rounded corners
        if (logoSrc) {
          const logoImage = new Image();
          logoImage.src = logoSrc;
          logoImage.onload = () => {
            // e.g. 20% of the QR code dimension
            const logoSize = CANVAS_SIZE * 0.2;
            // Center the logo
            const x = (CANVAS_SIZE - logoSize) / 2;
            const y = (CANVAS_SIZE - logoSize) / 2;
            // ~8% of the logo size for cornerRadius
            const cornerRadius = 0.08 * logoSize;

            ctx.save();
            // Begin path for rounded-corner clip
            ctx.beginPath();
            ctx.moveTo(x + cornerRadius, y);
            ctx.lineTo(x + logoSize - cornerRadius, y);
            ctx.quadraticCurveTo(
              x + logoSize,
              y,
              x + logoSize,
              y + cornerRadius
            );
            ctx.lineTo(x + logoSize, y + logoSize - cornerRadius);
            ctx.quadraticCurveTo(
              x + logoSize,
              y + logoSize,
              x + logoSize - cornerRadius,
              y + logoSize
            );
            ctx.lineTo(x + cornerRadius, y + logoSize);
            ctx.quadraticCurveTo(
              x,
              y + logoSize,
              x,
              y + logoSize - cornerRadius
            );
            ctx.lineTo(x, y + cornerRadius);
            ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
            ctx.closePath();
            ctx.clip();

            // Draw the logo inside our clipped round-corner region
            ctx.drawImage(logoImage, x, y, logoSize, logoSize);
            ctx.restore();

            // Convert to data URL (PNG) and store in state
            const dataUrl = canvas.toDataURL("image/png");
            setSrc(dataUrl);
            setDownloadUrl(dataUrl);
          };
        } else {
          // No logo, just convert the existing canvas directly
          const dataUrl = canvas.toDataURL("image/png");
          setSrc(dataUrl);
          setDownloadUrl(dataUrl);
        }
      };
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Something went wrong generating the QR code :(");
    }
  };

  // Function to download QR code (PNG only)
  const downloadQRCode = () => {
    if (!downloadUrl) return;

    // Clean up the link for the downloaded filename
    let cleanedLink = link.replace(/^(https?:\/\/)?/, "");
    const websiteName = cleanedLink.split("/")[0] || "qr-code";

    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `${websiteName}_qr.png`;
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

      {/* Display the generated QR code (or blank if not generated yet) */}
      <img
        className="rounded-[20px] mt-5 w-60 border-black shadow-xl"
        src={src}
      />

      {/* Hidden canvas to create the QR code + embed the logo */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Text input for the content/URL of the QR code */}
      <input
        className="mt-5 border shadow-xl font-mono text-zinc-700 w-[300px] h-[40px] rounded-md pl-2 pr-2 placeholder:pl-1"
        type="text"
        placeholder="Enter something ..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      {/* Generate button */}
      <button
        type="button"
        onClick={generateQRCode}
        className="bg-white shadow-xl text-black mt-5 w-[100px] h-[30px] rounded-md font-mono hover:bg-green-500 hover:text-white transition-all"
      >
        Generate
      </button>

      {/* Color picker */}
      <div className="mt-8 flex items-center">
        <label htmlFor="colorPicker" className="font-mono text-zinc-700 mr-3">
          Color:
        </label>
        <input
          id="colorPicker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-8 p-0 border-none"
        />
      </div>

      {/* File input for logo */}
      <p className="font-mono text-zinc-700 mt-2">Logo (optional):</p>
      <div className="flex items-center mt-1">
        <input
          id="logoPicker"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="font-mono text-zinc-700"
        />
      </div>

      {error && (
        <p className="text-red-500 font-mono text-xs mt-2">{error}</p>
      )}

      {/* Download button (PNG only) */}
      {downloadUrl && (
        <button
          type="button"
          onClick={downloadQRCode}
          className="bg-blue-500 text-white mt-4 w-[100px] h-[30px] rounded-md font-mono hover:bg-blue-700 transition-all"
        >
          Download
        </button>
      )}

      {/* Footer / Git link */}
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
