import { defineExtensionMessaging } from "@webext-core/messaging";

// Define message protocol
interface ProtocolMap {
  // TTS
  generateSpeech: (data: { text: string }) => { audio: string; contentType: string };

  // Translation
  translateText: (data: { text: string; targetLanguage: string }) => { translation: string };

  // Auth
  getAuthStatus: () => { isAuthenticated: boolean; user: { email: string; name?: string } | null };
  signIn: () => { success: boolean };
  signOut: () => { success: boolean };

  // Subscription
  getSubscriptionStatus: () => { isActive: boolean; plan?: string };
  createCheckoutSession: (data: { plan: "monthly" | "yearly" }) => { url: string };

  // Settings
  getTargetLanguage: () => { language: string };
  setTargetLanguage: (data: { language: string }) => { success: boolean };
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
