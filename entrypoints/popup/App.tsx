import { useState, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

interface User {
  email: string;
  name?: string;
  picture?: string;
}

type AuthMode = "signin" | "signup";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const signInWithEmail = useAction(api.auth.signInWithEmail);
  const signUpWithEmail = useAction(api.auth.signUpWithEmail);
  const signInWithGoogle = useMutation(api.auth.signInWithGoogle);

  useEffect(() => {
    chrome.storage.local.get(["user"], (result) => {
      if (result.user) {
        setUser(result.user);
      }
      setIsLoading(false);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError("");
    try {
      const token = await new Promise<string>((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (token) {
            resolve(token);
          } else {
            reject(new Error("No token received"));
          }
        });
      });

      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.ok) throw new Error("Failed to get user info");

      const userInfo = await response.json();

      await signInWithGoogle({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        googleId: userInfo.sub,
      });

      const userData: User = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };

      await chrome.storage.local.set({ user: userData });
      const { userStorage } = await import("@/lib/storage");
      await userStorage.setValue(userData);
      setUser(userData);
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Sign in failed");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError("");

    try {
      if (authMode === "signup") {
        await signUpWithEmail({ email, password, name: name || undefined });
        const result = await signInWithEmail({ email, password });
        const userData: User = { email, name: name || undefined };
        await chrome.storage.local.set({ user: userData });
        const { userStorage } = await import("@/lib/storage");
        await userStorage.setValue(userData);
        setUser(userData);
      } else {
        const result = await signInWithEmail({ email, password });
        const userData: User = {
          email: result.user.email,
          name: result.user.name,
        };
        await chrome.storage.local.set({ user: userData });
        const { userStorage } = await import("@/lib/storage");
        await userStorage.setValue(userData);
        setUser(userData);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        if (token) {
          chrome.identity.removeCachedAuthToken({ token }, () => {});
        }
      });

      await chrome.storage.local.remove(["user"]);
      const { userStorage } = await import("@/lib/storage");
      await userStorage.setValue(null);
      setUser(null);
      setShowEmailForm(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px] bg-white rounded-2xl">
        <Spinner className="size-5 text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[320px] bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden">
      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!user ? (
          <>
            {!showEmailForm ? (
              <>
                {/* Inner card for logo/status */}
                <div className="w-full bg-zinc-100 rounded-2xl p-6 mb-4 flex flex-col items-center border border-zinc-200 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </div>
                  <h1 className="text-lg font-semibold text-zinc-900 mb-1">
                    Hober
                  </h1>
                  <p className="text-sm text-zinc-500 text-center">
                    Sign in to use TTS and translation
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-red-500 mb-3 text-center">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  {isSigningIn ? (
                    <Spinner className="size-4" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 my-3 w-full">
                  <div className="flex-1 h-px bg-zinc-200" />
                  <span className="text-xs text-zinc-400">or</span>
                  <div className="flex-1 h-px bg-zinc-200" />
                </div>

                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Continue with Email
                </button>
              </>
            ) : (
              <form onSubmit={handleEmailAuth} className="w-full space-y-3">
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${
                      authMode === "signin"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition-colors ${
                      authMode === "signup"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                {authMode === "signup" && (
                  <input
                    type="text"
                    placeholder="Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSigningIn ? (
                    <Spinner className="size-4" />
                  ) : authMode === "signup" ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm(false);
                    setError("");
                  }}
                  className="w-full text-sm text-zinc-500 hover:text-zinc-700 py-2"
                >
                  Back
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            {/* Inner card for logged in state */}
            <div className="w-full bg-zinc-100 rounded-2xl p-6 flex flex-col items-center border border-zinc-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-zinc-900 mb-1">
                Ready to use
              </h2>
              <p className="text-sm text-zinc-500 text-center">
                Select text on any page to listen or translate
              </p>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 bg-white">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm text-zinc-600 truncate max-w-[120px]">
                {user.name || user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Sign out
            </button>
          </>
        ) : (
          <p className="text-xs text-zinc-400 w-full text-center">
            Hober · TTS & Translation
          </p>
        )}
      </footer>
    </div>
  );
}
