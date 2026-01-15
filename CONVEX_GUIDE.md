# Working with Convex Tables

This guide explains how to add a table to your database and how to query it, using the `numbers` example as a template.

---

## 1. Define the Schema
First, you must define your table in `convex/schema.ts`. This provides type safety and lets Convex know what data to expect.

**File:** `convex/schema.ts`
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables, // Includes built-in auth tables
  
  // Example Table: "numbers"
  numbers: defineTable({
    value: v.number(), // Define fields and their types
  }),
});
```

---

## 2. Create Backend Functions
Create queries (to read) and mutations (to write) in a file within the `convex/` directory.

**File:** `convex/myFunctions.ts`
```typescript
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// QUERY: Read the last 10 numbers
export const listNumbers = query({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    const numbers = await ctx.db
      .query("numbers")
      .order("desc") // Get newest first
      .take(args.count);
    
    return numbers.map((n) => n.value);
  },
});

// MUTATION: Insert a new number
export const addNumber = mutation({
  args: { value: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("numbers", { value: args.value });
  },
});
```

---

## 3. Use in Frontend (React)
Use the `useQuery` and `useMutation` hooks provided by `convex/react` to interact with your backend.

**File:** `app/page.tsx`
```tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  // 1. Fetch data using the query
  const numbers = useQuery(api.myFunctions.listNumbers, { count: 10 });

  // 2. Setup the mutation
  const addNumber = useMutation(api.myFunctions.addNumber);

  const handleAdd = async () => {
    await addNumber({ value: Math.floor(Math.random() * 100) });
  };

  if (numbers === undefined) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleAdd}>Add Random Number</button>
      <ul>
        {numbers.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Summary of Workflow
1.  **Schema**: Update `convex/schema.ts` with the new table structure.
2.  **Backend**: Write functions in `convex/` to interact with that table.
3.  **Frontend**: Call those functions using hooks in your components.

---

## 4. Server-Side Preloading (SSR)
If you want to load data on the server before the page hits the browser (better for SEO and performance), use `preloadQuery`.

### Step A: The Server Component
Create a server component that fetches the data and passes it to a client component.

**File:** `app/server/page.tsx`
```tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ClientComponent from "./inner";

export default async function ServerPage() {
  // 1. Preload the query on the server
  const preloaded = await preloadQuery(api.myFunctions.listNumbers, {
    count: 5,
  });

  return (
    <main>
      <h1>Server-Loaded Data</h1>
      {/* 2. Pass the preloaded data to a client component */}
      <ClientComponent preloaded={preloaded} />
    </main>
  );
}
```

### Step B: The Client Component
The client component uses `usePreloadedQuery` to consume the data. This data is available immediately without a loading state.

**File:** `app/server/inner.tsx`
```tsx
"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ClientComponent(props: {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
}) {
  // 3. Connect to the preloaded data
  const numbers = usePreloadedQuery(props.preloaded);

  return (
    <ul>
      {numbers.map((n, i) => (
        <li key={i}>{n}</li>
      ))}
    </ul>
  );
}
```

### Why use this?
- **Speed**: No "loading" spinner on initial page load.
- **SEO**: Search engines see the actual data in the HTML.
- **Interactivity**: The page is still a standard React Client Component, so you can still use hooks like `useMutation` for real-time updates.

---

## 5. Authentication & Middleware
Convex Auth for Next.js uses a middleware layer to sync authentication tokens and protect routes.

### Is there a Middleware?
Yes. You can create a `middleware.ts` file in your root directory to handle:
1.  **Route Protection**: Redirecting unauthenticated users away from private pages.
2.  **Auth Sync**: Keeping the server and client in sync regarding the user's session.

**Example:** `middleware.ts`
```typescript
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();
  
  // 1. Redirect unauthenticated users to sign-in
  if (!isSignInPage(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
  
  // 2. Redirect authenticated users away from sign-in
  if (isSignInPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  // The matcher determines which routes the middleware runs on
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### How is Auth State Passed?
You don't need to manually pass the user state. It is handled by the providers in your root layout:

1.  **`ConvexAuthNextjsServerProvider`**: Wraps the app on the server and ensures auth tokens are available in cookies.
2.  **`ConvexClientProvider`**: Uses those tokens to initialize the Convex client on the frontend.
3.  **Backend Hooks**: In your `convex/myFunctions.ts`, use `getAuthUserId(ctx)` to access the user:

```typescript
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getMyData = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    // Now you have the userId to filter data!
    return await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), userId))
      .collect();
  },
});
```
