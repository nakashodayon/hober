import { onMessage } from "@/lib/messaging";
import { targetLanguageStorage, userStorage } from "@/lib/storage";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convex = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL as string);

export default defineBackground(() => {
  console.log("Hober background script started");

  // Get target language
  onMessage("getTargetLanguage", async () => {
    const language = await targetLanguageStorage.getValue();
    return { language: language || "ja" };
  });

  // Set target language
  onMessage("setTargetLanguage", async ({ data }) => {
    await targetLanguageStorage.setValue(data.language);
    return { success: true };
  });

  // Generate speech with Eleven Labs via Convex
  onMessage("generateSpeech", async ({ data }) => {
    console.log(
      "[TTS] generateSpeech called with:",
      data.text.substring(0, 50),
    );
    const user = await userStorage.getValue();
    console.log("[TTS] user:", user);
    if (!user) {
      console.log("[TTS] No user found");
      throw new Error("Please log in first");
    }

    try {
      console.log("[TTS] Calling Convex action...");
      const result = await convex.action(api.tts.generateSpeech, {
        text: data.text,
        userEmail: user.email,
      });
      console.log("[TTS] Success, audio length:", result.audio?.length);
      return result;
    } catch (err) {
      console.error("[TTS] Error:", err);
      throw err;
    }
  });

  // Translate text with Gemini via Convex
  onMessage("translateText", async ({ data }) => {
    console.log(
      "[Translate] translateText called with:",
      data.text.substring(0, 50),
    );
    const user = await userStorage.getValue();
    console.log("[Translate] user:", user);
    if (!user) {
      console.log("[Translate] No user found");
      throw new Error("Please log in first");
    }

    try {
      console.log("[Translate] Calling Convex action...");
      const result = await convex.action(api.translate.translateText, {
        text: data.text,
        targetLanguage: data.targetLanguage,
        userEmail: user.email,
      });
      console.log("[Translate] Success:", result.translation?.substring(0, 50));
      return result;
    } catch (err) {
      console.error("[Translate] Error:", err);
      throw err;
    }
  });
});
