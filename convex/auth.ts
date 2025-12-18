import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

// Simple hash function for passwords (in production, use bcrypt via action)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Sign up with email and password
export const signUpWithEmail = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { email, password, name }) => {
    // Check if user exists
    const existingUser = await ctx.runQuery(
      "auth:getUserByEmailInternal" as any,
      { email },
    );

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = await ctx.runMutation("auth:createUserInternal" as any, {
      email,
      passwordHash,
      name,
    });

    return { success: true, userId };
  },
});

// Sign in with email and password
export const signInWithEmail = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    // Get user
    const user = await ctx.runQuery("auth:getUserByEmailInternal" as any, {
      email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.passwordHash) {
      throw new Error("Please sign in with Google");
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      throw new Error("Invalid email or password");
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  },
});

// Internal query to get user by email
export const getUserByEmailInternal = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// Internal mutation to create user
export const createUserInternal = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { email, passwordHash, name }) => {
    return await ctx.db.insert("users", {
      email,
      passwordHash,
      name,
      targetLanguage: "ja",
      emailVerified: false,
    });
  },
});

// Verify Google access token and get user info
export const verifyGoogleToken = action({
  args: { accessToken: v.string() },
  handler: async (ctx, { accessToken }) => {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    const userInfo = await response.json();

    return {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      googleId: userInfo.sub,
    };
  },
});

// Create or update user after Google sign-in
export const signInWithGoogle = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    picture: v.optional(v.string()),
    googleId: v.string(),
  },
  handler: async (ctx, { email, name, picture, googleId }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name,
        image: picture,
        googleId,
        emailVerified: true,
      });
      return {
        userId: existingUser._id,
        user: { ...existingUser, name, image: picture },
      };
    }

    const userId = await ctx.db.insert("users", {
      email,
      name,
      image: picture,
      googleId,
      targetLanguage: "ja",
      emailVerified: true,
    });

    return {
      userId,
      user: { email, name, image: picture },
    };
  },
});

// Get user by ID
export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  },
});
