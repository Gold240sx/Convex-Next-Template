import React, { ReactNode } from "react"
import { GetFormStats } from "@/actions/form"
import { LuView } from "react-icons/lu"
import { FaWpforms } from "react-icons/fa"
import { HiCursorClick } from "react-icons/hi"
import { TbArrowBounce } from "react-icons/tb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CardStatsWrapper = async () => {
	const stats = await GetFormStats()
	return <StatsCards loading={false} data={stats} />
}

interface StatsCardProps {
	data?: Awaited<ReturnType<typeof GetFormStats>>
	loading: boolean
}

export function StatsCards(props: StatsCardProps) {
	const { data, loading } = props
	return (
		<div className="w-full pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title="Total Visits"
				icon={<LuView className="text-blue-600" />}
				helperText="All time form visits"
				value={data?.visits.toLocaleString() || ""}
				loading={loading}
				className="shadow-md shadow-blue-600"
			/>
			<StatsCard
				title="Total Submissions"
				icon={<FaWpforms className="text-yellow-600" />}
				helperText="All time form submissions"
				value={data?.submissions.toLocaleString() || ""}
				loading={loading}
				className="shadow-md shadow-yellow-600"
			/>
			<StatsCard
				title="Submission Rate"
				icon={<HiCursorClick className="text-green-600" />}
				helperText="Visits that result in form submission"
				value={data?.submissionRate.toLocaleString() + "%" || ""}
				loading={loading}
				className="shadow-md shadow-green-600"
			/>
			<StatsCard
				title="Bounce Rate"
				icon={<TbArrowBounce className="text-red-600" />}
				helperText="Visits that result in no form submission"
				value={data?.bounceRate.toLocaleString() + "%" || ""}
				loading={loading}
				className="shadow-md shadow-red-600"
			/>
		</div>
	)
}

function StatsCard({
	title,
	value,
	icon,
	helperText,
	loading,
	className,
}: {
	title: string
	value: string
	icon: ReactNode
	helperText: string
	loading: boolean
	className: string
}) {
	return (
		<Card className={className}>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">
					{loading && (
						<Skeleton>
							<span>0</span>
						</Skeleton>
					)}
					{!loading && value}
				</div>
				<p className="text-xs text-muted-foreground pt-1">
					{helperText}
				</p>
			</CardContent>
		</Card>
	)
}

export default CardStatsWrapper
