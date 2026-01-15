//@ts-nocheck
import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components"
import * as React from "react"
import { Tailwind } from "@react-email/tailwind"

// Unresponsive - fixed width. Good starter Template

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ""

const CronJob_Error = ({
	day = 5,
	website = "MichaelMartell.com",
	apiEndpoint = "https://not-a-real-api.com/api/not-real",
	error = "no error at this time",
}: {
	day: number
	apiEndpoint: string
	error: string
}) => (
	<Tailwind
		config={{
			theme: {
				extend: {
					colors: {
						brand: "#007291",
					},
				},
			},
		}}>
		<Html>
			<Head />
			<Preview>{website} - Cron Job Error</Preview>
			<Body style={main} className="bg-white">
				<Container className="pb-12 mx-auto my-0 mb-16 bg-zinc-100 rounded-xl py-12">
					<Section className="px-12 py-0">
						<div className="flex flex-col md:flex-row gap-8">
							<div className="w-fit">
								<Img
									className="mt-2"
									src={`${baseUrl}/static/assets/MainLogoSunset.png`}
									width="auto"
									height="55"
									alt="icon"
								/>
							</div>
							<div className="">
								<Img
									className="absolute mt-7 ml-2"
									src={`${baseUrl}/static/assets/search.png`}
									width="auto"
									height="18"
									alt="icon"
								/>
								<div className="bg-zinc-400 w-1 h-6 absolute mt-6 ml-[15.5rem] "></div>
								<Text className="text-2xl tracking-wide bg-white py-1 pl-8 pr-4 rounded-lg  text-zinc-900">
									{website}
								</Text>
							</div>
						</div>
						<p className="font-semibold text-center text-zinc-900 text-lg">
							⚠️‼️ CRON JOB ERROR ‼️⚠️
						</p>
						<Hr style={hr} />
						<Text style={paragraph} className="text-zinc-900">
							The cron job pertaining to {website} has failed. As
							a result, the database has not been updated
							accordingly.
						</Text>
						<Text className="text-zinc-400 text-xl">
							This could be due to either one of several options:
						</Text>
						<ul className="space-y-2 list-inside list-disc text-zinc-900">
							<li className="">
								The cron job was unable to reach your API
								endpoint. The endpoint is located at:
								<Link
									href={apiEndpoint}
									className="underline ml-2">
									{apiEndpoint}
								</Link>
							</li>
							<li className="mt-2">
								The linux server crashed. Your server is held
								with digitalOcean.
							</li>
							<hr />
							<li className="">
								Your database password has been changed.
								<div className="text-zinc-400">
									<span className="text-zinc-500 text-xs w-full ml-4">
										Your password needs to be updated on the
										cron server. Contact{" "}
										<a
											href="mailto:hierrofernandes23@gmail.com"
											className="text-sky-500 underline cursor-pointer">
											Bonekazz
										</a>{" "}
										to update.
									</span>
								</div>
							</li>
							<li className="mt-2">
								Your API endpoint has been failing. Test your to
								api in Postman to verify.
								<p className="text-zinc-500 text-xs w-full ml-4"></p>
							</li>
							<li className="mt-2">
								Your database table: "Updates" doesn't contain
								any data.
								<p className="text-zinc-500 text-xs w-full ml-4">
									While the api endpoint is built to add new
									data if no data is present, I havn't fully
									gotten the api to include this feature yet.
								</p>
							</li>
							<li className="mt-2">
								Your havn't paid the bill for your linux server.
								<p className="text-zinc-500 text-xs w-full ml-4">
									See the link below to your server to ensure
									it's still live.
								</p>
							</li>
							<li className="mt-2">
								Your list of active sites does not include the
								listed website.
								<p className="text-zinc-500 text-xs w-full ml-4"></p>
							</li>
						</ul>
						<Text className="text-zinc-900 font-bold text-lg">
							Without taking any action, your database is set to
							go to sleep in {7 - day} days!
						</Text>
						<Text className="text-zinc-400 text-xl">
							Links to important resources:
						</Text>
						<div className="gap-4 flex flex-col pl-5 py-4 bg-white rounded-lg">
							<Link href="https://supabase.com/dashboard/project/qregsufrbbvldyfqitph/editor/29811?schema=public">
								ActiveSites
							</Link>
							<Link href="https://supabase.com/dashboard/project/jvnywieofpxgrmsdcsxm">
								David's Garage Pro WebSite
							</Link>
							<Link href="https://cloud.digitalocean.com/projects/4e8c49ac-141f-448a-9f19-077d498a205d/resources?i=f6a7d8">
								Linux Server
							</Link>
						</div>

						<Hr style={hr} />
						<Text className="text-xl font-semibold text-[#8898aa]">
							Error recieved from Linux Server:
						</Text>
						<div className="bg-zinc-200 p-6 text-zinc-900 rounded-lg">
							<Text className="">{error}</Text>
						</div>
						<Hr style={hr} />
						<Text
							style={paragraph}
							className="text-[#8898aa] text-xs">
							This email was recieved as an automated notification
							to the owners of the website. If you recieved this
							in error, please disregard. Your email will not be
							collected, sold, or solicited to. (someone may have
							misentered their email).
						</Text>
						<Link href="http://www.michaelmartell.com">
							<Text style={anchor} className="text-xs ">
								MichaelMartell.com
							</Text>
						</Link>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
)

export default CronJob_Error

const main = {
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const hr = {
	borderColor: "#e6ebf1",
	margin: "20px 0",
}

const paragraph = {
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
}

const anchor = {
	color: "#0FB4CC",
}
