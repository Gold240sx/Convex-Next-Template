import { GetFormById, GetFormWithSubmissions } from "@/actions/form"
import FormLinkShare from "@/components/buttons/FormLinkShare"
import VisitBtn from "@/components/buttons/VisitButton"
import React, { ReactNode } from "react"
import { ElementsType, FormElementInstance } from "@/components/FormElements"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { formatDistance } from "date-fns"
import CardStatsWrapper from "../../dashboard/CardStatsWrapper"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"

async function FormDetailsPage({
	params,
}: {
	params: {
		id: string
	}
}) {
	const { id } = params
	const form = await GetFormById(Number(id))
	if (!form) {
		throw new Error("form not found")
	}

	const { visits, submissions } = form

	let submissionRate = 0

	if (visits > 0) {
		submissionRate = (submissions / visits) * 100
	}

	const bounceRate = 100 - submissionRate

	return (
		<>
			<div className="py-10 border-b border-muted">
				<div className="flex justify-between container">
					<h1 className="text-4xl font-bold truncate">{form.name}</h1>
					<VisitBtn shareUrl={form.shareURL} />
				</div>
			</div>
			<div className="py-4 border-b border-muted">
				<div className="container flex gap-2 items-center justify-between">
					<FormLinkShare shareUrl={form.shareURL} />
				</div>
			</div>
			<div className="container">
				<CardStatsWrapper />
			</div>
			<div className="container pt-10">
				<SubmissionsTable id={form.id} />
			</div>
		</>
	)
}

export default FormDetailsPage

// custom rowcells for the date field and the checkbox field, otherwise, it just renders the value
function RowCell({ type, value }: { type: ElementsType; value: string }) {
	let node: ReactNode = value
	switch (type) {
		case "DateField":
			if (!value) break
			const date = new Date(value)
			node = (
				<Badge variant={"outline"}> {format(date, "dd/MM/yyy")}</Badge>
			)
			break
		case "CheckBoxField":
			const checked = value === "true"
			node = <Checkbox checked={checked} disabled />
			break
	}
	return <TableCell>{node}</TableCell>
}

async function SubmissionsTable({ id }: { id: number }) {
	const form = await GetFormWithSubmissions(id)
	if (!form) {
		throw new Error("Form not found")
	}

	const formElements = JSON.parse(form!.content) as FormElementInstance[]
	const columns: {
		id: string
		label: string
		required: boolean
		type: ElementsType
	}[] = []

	formElements.forEach((element) => {
		switch (element.type) {
			case "TextField":
			case "CheckBoxField":
			case "DateField":
			case "SelectField":
			case "TextAreaField":
			case "NumberField":
				// case "RadioField": // shadcn
				// case "SwitchField": // shadcn
				// case "StepperField": // custom
				columns.push({
					id: element.id,
					label: element.extraAttributes?.label,
					required: element.extraAttributes?.required,
					type: element.type,
				})
				break
			default:
				break
		}
	})

	type Row = {
		[key: string]: string
	} & {
		submittedAt: Date
	}

	const rows: Row[] = []
	form?.FormSubmissions.forEach((submission) => {
		const content = JSON.parse(submission.content)
		rows.push({
			...content,
			submittedAt: submission.createdAt,
		})
	})

	return (
		<>
			{rows.length > 0 && (
				<>
					<h1 className="text-2xl font-bold my-4">Submissions</h1>
					<Table>
						<TableHeader>
							<TableRow>
								{columns.map((column) => (
									<TableHead
										key={column.id}
										className="uppercase overflow-ellipsis whitespace-nowrap">
										{column.label}
									</TableHead>
								))}
								<TableHead className="text-muted-foreground text-right uppercase">
									Submitted at:
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="mb-10">
							{rows.map((row, index) => (
								<TableRow key={index}>
									{columns.map((column) => (
										<RowCell
											key={column.id}
											type={column.type}
											value={row[column.id]}
										/>
									))}
									<TableCell className="text-right text-muted-foreground">
										{formatDistance(
											row.submittedAt,
											new Date(),
											{
												addSuffix: true,
											}
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</>
			)}
			{rows.length === 0 && (
				<>
					<h1 className="text-2xl font-bold my-4 text-zinc-500">
						There has been no submissions yet
					</h1>
				</>
			)}
		</>
	)
}
