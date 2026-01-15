"use client";

import  Link  from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Unauthenticated, Authenticated } from "convex/react";
import { Button } from "@/components/shadcn/button"
import { FC } from "react";

export const SignInSection: FC = () => {
  return (
	<>
    <Unauthenticated>
      <div className="bg-teal-500 hover:bg-teal-400 text-black font-bold py-2 px-4 rounded transition-colors cursor-pointer">
        <SignInButton />
      </div>
    </Unauthenticated>
	<Authenticated>
		<Link href="/dashboard">
		<Button>Dashboard</Button>
		</Link>
	</Authenticated>
	</>
  );
};
