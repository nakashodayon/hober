import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const generateSpeech = action({
  args: { text: v.string(), userEmail: v.optional(v.string()) },
  handler: async (ctx, { text, userEmail }) => {
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

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error("Eleven Labs API key not configured");
    }

    const voiceId = "8EkOjt4xTPGMclNlh1pk";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_v3",
          output_format: "mp3_44100_128",
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Eleven Labs API error: ${error}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Convert to base64 in chunks to avoid stack overflow
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64 = btoa(binary);

    return {
      audio: base64,
      contentType: "audio/mpeg",
    };
  },
});
