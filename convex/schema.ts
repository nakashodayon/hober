import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.optional(v.string()),
    googleId: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    targetLanguage: v.string(),
    emailVerified: v.optional(v.boolean()),
  }).index("by_email", ["email"]),
});
