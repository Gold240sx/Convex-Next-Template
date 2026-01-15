"use client"
import { Button } from "@/components/shadcn/button";
import Link from "next/link";

export default function ErrorPage(
	{error}: {
		error: Error & { digest?: string }
	}
) {
	return (
		<div>
			<h1>Something went wrong!</h1>
			<p>{error.message}</p>
			          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
		</div>
	)
}