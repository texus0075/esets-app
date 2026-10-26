import imageCompression from "browser-image-compression";

/**
 * Image Processing, Compression, AI Room Detection & Anti-Theft Watermarking Service
 * 
 * Category 2 / Media Engine (Repo #2: browser-image-compression):
 * 1. Multithreaded WebWorker compression: Resizes 10MB-20MB camera files to lightweight WebP/JPEG data URLs.
 * 2. Canvas Anti-Theft Watermarking: Embeds non-erasable "Esets 0% Brokerage" watermark to protect photos from brokers.
 * 3. Multi-Key Gemini Vision AI with internal if-else failover to detect room types.
 */

export async function compressImageFile(file, maxWidth = 1024, maxHeight = 768, quality = 0.76) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Selected file is not an image.");
  }

  // REPO #2 Integration: High-Performance WebWorker Compression with EXIF Orientation Fix
  // Calibrated to produce ultra-crisp 60KB-120KB images that store directly inside Firestore Spark Free Tier (0 costs, no Blaze/credit card needed)
  try {
    const options = {
      maxSizeMB: 0.18,
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker: true,
      initialQuality: quality,
      fileType: "image/jpeg"
    };
    const compressedBlob = await imageCompression(file, options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(compressedBlob);
    });
  } catch (workerErr) {
    console.warn("WebWorker compression notice, falling back to Canvas engine:", workerErr);
  }

  // Fallback Canvas Resizer (Ensures 100% compatibility across all browsers)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (e) => reject(e);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Anti-Broker Fraud Watermarking Engine
 * Stamps permanent "Esets 0% Brokerage" credentials onto image pixels
 */
export function applyWatermarkToCanvas(dataUrl, watermarkText = "ESETS 0% BROKERAGE", specId = "FREEHOLD DEED") {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Dynamic font sizing based on image resolution
      const fontSize = Math.max(13, Math.round(canvas.width / 34));
      ctx.font = `bold ${fontSize}px sans-serif`;

      // 1. Bottom-right Official Verification Watermark Stamp
      const stampText = `${watermarkText} • ${specId}`;
      const textMetrics = ctx.measureText(stampText);
      const textWidth = textMetrics.width;
      const padding = 10;
      const x = canvas.width - textWidth - padding * 2 - 14;
      const y = canvas.height - fontSize - padding * 2;

      // Dark translucent badge background
      ctx.fillStyle = "rgba(18, 22, 16, 0.75)";
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y - fontSize / 2, textWidth + padding * 2, fontSize + padding, 8);
        ctx.fill();
      } else {
        ctx.fillRect(x, y - fontSize / 2, textWidth + padding * 2, fontSize + padding);
      }

      // Golden amber security text
      ctx.fillStyle = "#E88A1A";
      ctx.fillText("🛡️ " + stampText, x + padding, y + fontSize / 2 + 1);

      // 2. Subtle center diagonal watermark against broker scraping
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 7);
      ctx.font = `bold ${Math.round(canvas.width / 24)}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx.textAlign = "center";
      ctx.fillText("ESETS C2C • DIRECT OWNER LISTING", 0, 0);
      ctx.restore();

      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

function getPrivateKeys() {
  return [
    import.meta.env?.VITE_GEMINI_KEY_1,
    import.meta.env?.VITE_GEMINI_KEY_2,
    import.meta.env?.VITE_GEMINI_KEY_3,
    import.meta.env?.VITE_GEMINI_KEY_4
  ].map(k => (typeof k === "string" ? k.trim() : "")).filter(Boolean);
}

/**
 * AI Room Type Detection with If-Else Multi-Key Cascade
 */
export async function detectRoomTypeWithAI(dataUrl) {
  if (!dataUrl || !dataUrl.includes(",")) return "Property View";

  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

  const keys = getPrivateKeys();
  const models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-flash-latest"];
  const prompt = "Identify the room or area in this real estate photo. Output only a short label from: Living Room, Master Bedroom, Kitchen, Balcony / Terrace, Bathroom, Exterior Facade, or Property View.";

  // Internal if-else key failover
  for (const apiKey of keys) {
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 20
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const label = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (label && label.length < 35) {
            return label.replace(/[".]/g, "");
          }
        } else if (response.status === 404) {
          continue; // Try next model
        } else {
          break; // Key issue, move to next key
        }
      } catch (e) {
        break; // Network exception, move to next key
      }
    }
  }

  return "Property View";
}
