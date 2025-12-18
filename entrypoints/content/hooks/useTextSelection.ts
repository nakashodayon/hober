import { useState, useEffect, useCallback } from "react";

interface SelectionPosition {
  x: number;
  y: number;
}

interface UseTextSelectionReturn {
  selectedText: string;
  position: SelectionPosition | null;
  isVisible: boolean;
  clearSelection: () => void;
}

export function useTextSelection(): UseTextSelectionReturn {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<SelectionPosition | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedText("");
    setPosition(null);
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 0) {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();

          if (rect) {
            // Position the card near the selection
            const x = rect.left + rect.width / 2;
            const y = rect.bottom + window.scrollY + 8;

            setSelectedText(text);
            setPosition({ x, y });
            setIsVisible(true);
          }
        }
      }, 10);
    };

    const handleMouseDown = (event: MouseEvent) => {
      // Check if clicking outside the selection card
      const target = event.target as HTMLElement;

      // Check in regular DOM
      if (target.closest("[data-hober-card]")) {
        return;
      }

      // Check in Shadow DOM - look for hober-ui shadow host
      const path = event.composedPath();
      const isInsideHober = path.some((el) => {
        if (el instanceof HTMLElement) {
          return (
            el.hasAttribute?.("data-hober-card") ||
            el.id === "hober-root" ||
            el.tagName?.toLowerCase() === "hober-ui"
          );
        }
        return false;
      });

      if (!isInsideHober) {
        clearSelection();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSelection();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearSelection]);

  return {
    selectedText,
    position,
    isVisible,
    clearSelection,
  };
}
