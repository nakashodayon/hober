import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;

export const authClient = createAuthClient({
  baseURL: convexUrl?.replace(".convex.cloud", ".convex.site") || "",
  plugins: [convexClient()],
});

export const { signIn, signOut, useSession } = authClient;
