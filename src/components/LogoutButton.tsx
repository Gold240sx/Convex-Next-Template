"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function LogoutButton() {
  const { signOut } = useAuthActions();

  return (
    <button
      onClick={() => void signOut()}
      className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200"
    >
      Log Out
    </button>
  );
}
