import { Skeleton } from "@/components/ui/skeleton"
import { GetForms } from "@/actions/form"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardTitle,
	CardHeader,
	CardDescription,
	CardContent,
	CardFooter,
} from "./ui/card"
import { Form } from "@prisma/client"
import { Badge } from "./ui/badge"
import { formatDistance } from "date-fns"
import { LuView } from "react-icons/lu"
import { FaWpforms } from "react-icons/fa"
import Link from "next/link"
import { BiRightArrowAlt } from "react-icons/bi"
import { FaEdit } from "react-icons/fa"

const FormCardSkeleton = () => {
	return <Skeleton className="border-2 border-primary/20 h-[190] w-full" />
}

const FormCards = async () => {
	const forms = await GetForms()
	return (
		<>
			{forms.map((form, index) => (
				<FormCard key={index} form={form} />
			))}
		</>
	)
}

const FormCard = ({ form }: { form: Form }) => {
	return (
		<Card className="border-2 border-primary/20 h-[190px] w-full">
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
							<LuView className="text-mused-foreground" />
							<span>{form.visits.toLocaleString()}</span>
							<FaWpforms className="text-mused-foreground" />
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
							View Submissions
							<BiRightArrowAlt />
						</Link>
					</Button>
				)}
				{!form.published && (
					<Button
						asChild
						variant={"secondary"}
						className="w-full mt-2 text-md gap-4">
						<Link href={`/builder/${form.id}`}>
							Edit form
							<FaEdit />
						</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}

export { FormCards, FormCardSkeleton }
