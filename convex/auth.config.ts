import type { AuthConfig } from "convex/server";

// No external auth providers - we verify Google tokens directly in actions
const config: AuthConfig = {
  providers: [],
};

export default config;
