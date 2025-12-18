import { useEffect } from "react";
import { useTextSelection } from "./hooks/useTextSelection";
import { SelectionCard } from "./components/SelectionCard";

export default function App() {
  const { selectedText, position, isVisible, clearSelection } =
    useTextSelection();

  useEffect(() => {
    console.log("[Hober App] State:", {
      selectedText: selectedText?.substring(0, 30),
      position,
      isVisible,
    });
  }, [selectedText, position, isVisible]);

  if (!isVisible || !selectedText || !position) {
    return null;
  }

  console.log("[Hober App] Rendering SelectionCard");

  return (
    <SelectionCard
      text={selectedText}
      position={position}
      onClose={clearSelection}
    />
  );
}
