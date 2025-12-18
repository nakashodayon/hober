import { defineConfig } from "wxt";
import { resolve } from "node:path";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  alias: {
    "@": resolve(__dirname),
  },
  manifest: {
    name: "Hober",
    description: "Text-to-Speech and Translation with Eleven Labs & Gemini",
    version: "0.0.1",
    permissions: ["storage", "activeTab", "identity"],
    host_permissions: ["<all_urls>"],
    oauth2: {
      client_id:
        "210855294534-5vokieq0s7alpi4kl39618cmravd6vr8.apps.googleusercontent.com",
      scopes: ["openid", "email", "profile"],
    },
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAssAxV2ShyloPFHDZmZ4wx9DOyQ5rhbAL98uPmAeagT3Aw8XLoLyx6HcmVFLGI1ZikX7cHKRErrKPZ+MW9CQ83oXZzJFiqO8fS0/84b7iEFLr0Z8yqjbhs/KF7VlY356munIjsLL/AcuGIk3FSCO/3+GzWSJqBZHamReDplUZn/LLRKyhBIVQeVPDzi+1MdyE2UmkljcAjFvvy93nCuH+Jjji6Yk4duQOsspMxzi18Lgull3LS+D4xBJPx7YMj39zf+l71nLdZvwKoOEyk5PsMgepXd7R859QBcG2BIA1903SqMqvW0C+hxBj8wtbi6qZTv32aX7rxpJgYENVc57YRQIDAQAB",
  },
});
