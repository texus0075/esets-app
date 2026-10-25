/**
 * Image Processing, Compression & AI Room Detection Service
 * 
 * 1. Client-side canvas compression: Resizes 10MB camera files to lightweight WebP/JPEG data URLs.
 * 2. Multi-Key Gemini Vision AI with internal if-else failover to detect room types (Living Room, Bedroom, Kitchen, Balcony).
 * 3. Graceful fallback when offline or without keys.
 */

export function compressImageFile(file, maxWidth = 1280, maxHeight = 960, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image."));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
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

        // Convert to lightweight JPEG data URL
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
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

  return null;
}
