/// <reference types="wxt/browser" />
import { storage } from "#imports";

// Target language for translation
export const targetLanguageStorage = storage.defineItem<string>(
  "local:targetLanguage",
  { fallback: "ja" },
);

// User info storage
interface UserData {
  email: string;
  name?: string;
  picture?: string;
}

export const userStorage = storage.defineItem<UserData | null>("local:user", {
  fallback: null,
});
