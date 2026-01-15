"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SignOutButton } from "../components/SignOutButton";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-700 flex flex-row justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Image src="/convex.svg" alt="Convex Logo" width={32} height={32} />
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <Image
              src="/nextjs-icon-light-background.svg"
              alt="Next.js Logo"
              width={32}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/nextjs-icon-dark-background.svg"
              alt="Next.js Logo"
              width={32}
              height={32}
              className="hidden dark:block"
            />
          </div>
          <h1 className="font-semibold text-slate-800 dark:text-slate-200">
            Convex + Next.js + Convex Auth
          </h1>
        </div>
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-8">
        <Content />
      </main>
    </>
  );
}



function Content() {
  const user = useQuery(api.myFunctions.viewer);
  const posts = useQuery(api.myFunctions.getUsersPosts);
  const createPost = useMutation(api.myFunctions.createPost);

  if (user === undefined || posts === undefined) {
    return (
      <div className="mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <p className="ml-2 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      <div>
        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-200">
          Welcome {user?.email ?? user?.name ?? "Anonymous"}!
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          This is your private dashboard. Only you can see your posts.
        </p>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl text-slate-800 dark:text-slate-200">
          Your Posts
        </h2>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem("text") as HTMLInputElement;
            if (input.value) {
              await createPost({ text: input.value });
              input.value = "";
            }
          }}
        >
          <input
            name="text"
            placeholder="Write something..."
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-all border-none"
          >
            Post
          </button>
        </form>

        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-4 shadow-sm">
          {posts.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic text-sm text-center">
              No posts yet. Try writing one above!
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="text-slate-700 dark:text-slate-300 text-sm border-b border-slate-200 dark:border-slate-700 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0"
                >
                  {post.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700"></div>

      <p className="text-slate-600 dark:text-slate-400">For more information, see the <Link href="/info">info page</Link>.</p>

    </div>
  );
}

