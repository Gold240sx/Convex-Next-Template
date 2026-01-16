import { Suspense, ReactNode } from "react"
import StatsCards from "./CardStatsWrapper"
import CardStatsWrapper from "./CardStatsWrapper"
import { NextPage } from "next"
import { Separator } from "@/components/ui/separator"
import CreateFormButton from "@/components/CreateFormButton"
import { Skeleton } from "@/components/ui/skeleton"
import { GetForms } from "@/actions/form"
import { Form } from "@prisma/client"
import { formatDistance } from "date-fns"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BiRightArrowAlt } from "react-icons/bi"
import { FaEdit } from "react-icons/fa"
import { LuView } from "react-icons/lu"
import { FaWpforms } from "react-icons/fa"

const Dashboard: NextPage = async () => {
	return (
		<div className="flex-1 w-full flex flex-col items-center">
			<div className="w-full">
				<div className="py-1 font-bold dark:bg-purple-950 bg-purple-400 text-center">
					This is a protected page that you can only see as an
					authenticated user
				</div>
			</div>

			<div className="container pt-4 pb-10">
				<Suspense fallback={<StatsCards />}>
					<CardStatsWrapper />
				</Suspense>
				<Separator className="my-6" />
				<h2 className="4xl font-bold col-span-2">Your Forms</h2>
				<Separator className="my-6" />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<CreateFormButton />
					<Suspense
						fallback={[1, 2, 3, 4].map((el) => (
							<FormCardSkeleton key={el} />
						))}>
						<FormCards />
					</Suspense>
				</div>
			</div>

			<footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
				<p>
					Powered by{" "}
					<a
						href="https://clerk.com/docs/quickstarts/nextjs"
						target="_blank"
						className="font-bold hover:underline"
						rel="noreferrer">
						Clerk
					</a>
				</p>
			</footer>
		</div>
	)
}

function FormCardSkeleton() {
	return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />
}

async function FormCards() {
	const forms = await GetForms()
	return (
		<>
			{forms.map((form) => (
				<FormCard key={form.id} form={form} />
			))}
		</>
	)
}

function FormCard({ form }: { form: Form }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 justify-between">
					<span className="truncate font-bold">{form.name}</span>
					{form.published && <Badge>Published</Badge>}
					{!form.published && (
						<Badge variant={"destructive"}>Draft</Badge>
					)}
				</CardTitle>
				<CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
					{formatDistance(form.createdAt, new Date(), {
						addSuffix: true,
					})}
					{form.published && (
						<span className="flex items-center gap-2">
							<LuView className="text-muted-foreground" />
							<span>{form.visits.toLocaleString()}</span>
							<FaWpforms className="text-muted-foreground" />
							<span>{form.submissions.toLocaleString()}</span>
						</span>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[20px] truncate text-sm text-muted-foreground">
				{form.description || "No description"}
			</CardContent>
			<CardFooter>
				{form.published && (
					<Button asChild className="w-full mt-2 text-md gap-4">
						<Link href={`/forms/${form.id}`}>
							View submissions <BiRightArrowAlt />
						</Link>
					</Button>
				)}
				{!form.published && (
					<Button
						asChild
						variant={"secondary"}
						className="w-full mt-2 text-md gap-4">
						<Link href={`/builder/${form.id}`}>
							Edit form <FaEdit />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}

export default Dashboard
