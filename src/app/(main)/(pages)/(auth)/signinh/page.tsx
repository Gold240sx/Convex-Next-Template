"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="app-container">
      <div className="main-card-wrapper max-w-lg">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 mb-4">
            <Image
              src="/convex.svg"
              alt="Convex Logo"
              width={80}
              height={80}
            />
            <div className="w-px h-16 bg-slate-300 dark:bg-slate-600"></div>
            <Image
              src="/nextjs-icon-light-background.svg"
              alt="Next.js Logo"
              width={80}
              height={80}
              className="dark:hidden"
            />
            <Image
              src="/nextjs-icon-dark-background.svg"
              alt="Next.js Logo"
              width={80}
              height={80}
              className="hidden dark:block"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 italic">
            Convex + Next.js
          </h1>
          <p className="text-slate-400 max-w-sm">
            Please sign in or sign up to access your portfolio content.
          </p>
        </div>

        {/* OAuth Providers */}
        <div className="flex flex-col gap-3 w-full action-card !p-6">
          <button
            onClick={() => void signIn("github")}
            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-lg py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
          <button
            onClick={() => void signIn("google")}
            className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-lg py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-slate-300"
          >
            <svg className="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button
            onClick={() => void signIn("discord")}
            className="flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
            </svg>
            Continue with Discord
          </button>
          
          <div className="relative flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-slate-600"></div>
            <span className="text-sm text-slate-400 font-medium whitespace-nowrap px-2">or use email</span>
            <div className="flex-1 h-px bg-slate-600"></div>
          </div>
          
          <form
            className="flex flex-col gap-4 w-full mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setError(null);
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", flow);
              void signIn("password", formData)
                .catch((error) => {
                  setError(error.message);
                  setLoading(false);
                })
                .then(() => {
                  router.push("/");
                });
            }}
          >
            <input
              className="bg-slate-900 text-white rounded-lg p-3 border border-slate-700 focus:border-slate-500 outline-none transition-all placeholder:text-slate-500"
              type="email"
              name="email"
              placeholder="Email address"
              required
            />
            <div className="flex flex-col gap-1">
              <input
                className="bg-slate-900 text-white rounded-lg p-3 border border-slate-700 focus:border-slate-500 outline-none transition-all placeholder:text-slate-500"
                type="password"
                name="password"
                placeholder="Password"
                minLength={8}
                required
              />
            </div>
            <button
              className="bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-lg py-3 shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : flow === "signIn" ? "Sign In" : "Create Account"}
            </button>
            <div className="flex flex-row gap-2 text-sm justify-center mt-2">
              <span className="text-slate-400">
                {flow === "signIn" ? "New here?" : "Already joined?"}
              </span>
              <button
                type="button"
                className="text-slate-200 hover:text-white font-medium underline"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              >
                {flow === "signIn" ? "Create an account" : "Sign in instead"}
              </button>
            </div>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mt-2">
                <p className="text-rose-400 font-medium text-sm text-center">
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
