"use client";

import { useRef, useState } from "react";
import type { LessonResponse } from "@/lib/types";

interface ShareImageGeneratorProps {
  lesson: LessonResponse;
  onClose: () => void;
}

export default function ShareImageGenerator({ lesson, onClose }: ShareImageGeneratorProps) {
  const [format, setFormat] = useState<"square" | "story">("square");
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dimensions = format === "square"
    ? { width: 1080, height: 1080 }
    : { width: 1080, height: 1920 };

  async function handleDownload() {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#FAF7F2",
        useCORS: true,
        logging: false,
      });

      // Try Web Share API first (mobile)
      if (navigator.share && typeof navigator.canShare === "function") {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], "lesson.png", { type: "image/png" });
          try {
            await navigator.share({ files: [file], title: "Make Me Wiser", url: window.location.origin });
          } catch {
            // Fallback to download
            downloadCanvas(canvas);
          }
        }, "image/png");
      } else {
        downloadCanvas(canvas);
      }
    } catch (err) {
      console.error("Share image error:", err);
    } finally {
      setGenerating(false);
    }
  }

  function downloadCanvas(canvas: HTMLCanvasElement) {
    const link = document.createElement("a");
    link.download = "make-me-wiser.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-2xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">Share this lesson</h3>
          <button onClick={onClose} className="text-secondary hover:text-primary text-xl leading-none">×</button>
        </div>

        {/* Format selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setFormat("square")}
            className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
              format === "square"
                ? "bg-button-fill text-cream border-button-fill"
                : "border-card-border text-secondary hover:border-secondary"
            }`}
          >
            Square 1:1
          </button>
          <button
            onClick={() => setFormat("story")}
            className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
              format === "story"
                ? "bg-button-fill text-cream border-button-fill"
                : "border-card-border text-secondary hover:border-secondary"
            }`}
          >
            Story 9:16
          </button>
        </div>

        {/* Preview card (scaled down for display, captured at full size) */}
        <div className="overflow-hidden rounded-xl border border-card-border" style={{ aspectRatio: format === "square" ? "1/1" : "9/16", maxHeight: 300 }}>
          <div
            ref={cardRef}
            style={{
              width: dimensions.width,
              height: dimensions.height,
              background: "#FAF7F2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "120px",
              fontFamily: "Georgia, serif",
              transform: `scale(${format === "square" ? 0.26 : 0.145})`,
              transformOrigin: "top left",
            }}
          >
            <div style={{ maxWidth: 840, textAlign: "center" }}>
              <p style={{ fontSize: 64, lineHeight: 1.4, color: "#2C2C2C", marginBottom: 60 }}>
                {lesson.life_lesson.replace(/[.!?]+\s*$/, "")} ~
              </p>
              <p style={{ fontSize: 36, color: "#8A8478", marginBottom: 80 }}>
                {lesson.person_name}
                {lesson.person_age ? `, ${lesson.person_age}` : ""}, {lesson.country}
              </p>
              <div style={{ borderTop: "2px solid #E5E0D8", paddingTop: 48 }}>
                <p style={{ fontSize: 28, color: "#2C2C2C", letterSpacing: 4, textTransform: "uppercase" }}>
                  Make Me Wiser
                </p>
                <p style={{ fontSize: 20, color: "#8A8478", marginTop: 12 }}>
                  A Project FUEL initiative
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={generating}
          className="w-full py-3 bg-button-fill text-cream rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {generating ? "Generating..." : "Download / Share"}
        </button>

        <p className="text-xs text-secondary text-center">
          Or{" "}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin);
            }}
            className="underline hover:text-primary transition-colors"
          >
            copy link
          </button>{" "}
          to share wiser.projectfuel.in
        </p>
      </div>
    </div>
  );
}
