import { useState } from "react";
import { sendMessage } from "@/lib/messaging";
import { SpeakerIcon } from "../icons/SpeakerIcon";
import { TranslateIcon } from "../icons/TranslateIcon";
import { LoadingIcon } from "../icons/LoadingIcon";

interface SelectionCardProps {
  text: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function SelectionCard({ text, position, onClose }: SelectionCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSpeak = async () => {
    if (isPlaying) return;

    console.log(
      "[SelectionCard] handleSpeak called, text:",
      text.substring(0, 50),
    );
    setIsPlaying(true);
    setError(null);

    try {
      console.log("[SelectionCard] Sending generateSpeech message...");
      const result = await sendMessage("generateSpeech", { text });
      console.log("[SelectionCard] Got result:", result);

      // Convert base64 to audio and play
      const audioData = `data:${result.contentType};base64,${result.audio}`;
      const audio = new Audio(audioData);

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setError("Failed to play audio");
      };

      await audio.play();
    } catch (err) {
      console.error("[SelectionCard] TTS error:", err);
      setIsPlaying(false);
      const message = err instanceof Error ? err.message : "TTS failed";
      setError(message);
    }
  };

  const handleTranslate = async () => {
    if (isTranslating) return;

    console.log(
      "[SelectionCard] handleTranslate called, text:",
      text.substring(0, 50),
    );
    setIsTranslating(true);
    setError(null);

    try {
      console.log("[SelectionCard] Getting target language...");
      const { language } = await sendMessage("getTargetLanguage", undefined);
      console.log("[SelectionCard] Target language:", language);

      console.log("[SelectionCard] Sending translateText message...");
      const result = await sendMessage("translateText", {
        text,
        targetLanguage: language,
      });
      console.log("[SelectionCard] Got translation:", result);

      setTranslation(result.translation);
    } catch (err) {
      console.error("[SelectionCard] Translate error:", err);
      const message = err instanceof Error ? err.message : "Translation failed";
      setError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyTranslation = async () => {
    if (translation) {
      await navigator.clipboard.writeText(translation);
    }
  };

  // Calculate position to keep card in viewport
  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: "translateX(-50%)",
    zIndex: 2147483647,
  };

  return (
    <div data-hober-card style={cardStyle} className="hober-card">
      <div className="hober-card-inner">
        {/* Action buttons */}
        <div className="hober-actions">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[Button] TTS button clicked");
              handleSpeak();
            }}
            disabled={isPlaying}
            className="hober-btn"
            title="Read aloud"
          >
            {isPlaying ? (
              <LoadingIcon className="hober-icon hober-spin" />
            ) : (
              <SpeakerIcon className="hober-icon" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[Button] Translate button clicked");
              handleTranslate();
            }}
            disabled={isTranslating}
            className="hober-btn"
            title="Translate"
          >
            {isTranslating ? (
              <LoadingIcon className="hober-icon hober-spin" />
            ) : (
              <TranslateIcon className="hober-icon" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("[Button] Close button clicked");
              onClose();
            }}
            className="hober-btn hober-btn-close"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Translation result */}
        {translation && (
          <div className="hober-translation">
            <p className="hober-translation-text">{translation}</p>
            <button
              onClick={handleCopyTranslation}
              className="hober-copy-btn"
              title="Copy translation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
          </div>
        )}

        {/* Error message */}
        {error && <div className="hober-error">{error}</div>}
      </div>
    </div>
  );
}
