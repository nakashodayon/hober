import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const translateText = action({
  args: {
    text: v.string(),
    targetLanguage: v.string(),
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, { text, targetLanguage, userEmail }) => {
    // Simple auth check - require email to be passed
    if (!userEmail) {
      throw new Error("Unauthorized: Please log in");
    }

    // TODO: Add subscription check later
    // const hasSubscription = await ctx.runQuery(
    //   api.subscriptions.hasActiveSubscription
    // );
    // if (!hasSubscription) {
    //   throw new Error("Subscription required");
    // }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following text to ${targetLanguage}. Only return the translation, nothing else. Do not add any explanations or notes.\n\nText to translate:\n${text}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const translation = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!translation) {
      throw new Error("No translation received from Gemini");
    }

    return { translation: translation.trim() };
  },
});
