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

const DB_Update_Severe_Error = ({
	day = 5,
	error = "no error at this time",
}: {
	day: number
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
			<Preview>
				Day-{day}: Michaelmartell.com - Severe Cronjob Error!
			</Preview>
			<Body style={main} className="bg-red-900">
				<Container className="pb-12 mx-auto my-0 mb-16 bg-red-800 rounded-xl py-12">
					<Section className="px-12 py-0">
						<div className="flex flex-row w-full gap-8">
							<div className="w-fit">
								<Img
									className="mt-2 ml-4"
									src={`${baseUrl}/static/assets/MainLogoInvert.png`}
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
								<div className="bg-red-500 w-1 h-6 absolute mt-6 ml-[15.5rem] "></div>
								<Text className="text-2xl tracking-wide bg-red-700 py-1 pl-8 pr-4 rounded-lg  text-white">
									MichaelMartell.com
								</Text>
							</div>
						</div>
						<p className="font-semibold text-center text-white text-lg">
							⚠️‼️ SEVERE DB UPDATE ERROR ‼️⚠️
						</p>
						<Hr style={hr} />
						<Text style={paragraph} className="text-white">
							It has been {day} days since the last successful
							database update, and as such, your database is set
							to be put to sleep.
						</Text>
						<Text className="text-zinc-400 text-xl">
							This could be due to either one of several options:
						</Text>
						<ul className="space-y-2 list-inside list-disc text-white">
							<li className="">
								Your database password has been changed.
								<div className="text-zinc-400">
									<span className="text-red-300 text-xs w-full ml-4">
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
								<p className="text-red-300 text-xs w-full ml-4"></p>
							</li>
							<li className="mt-2">
								Your database table: "Updates" doesn't contain
								any data.
								<p className="text-red-300 text-xs w-full ml-4">
									While the api endpoint is built to add new
									data if no data is present, I havn't fully
									gotten the api to include this feature yet.
								</p>
							</li>
							<li className="mt-2">
								Your havn't paid the bill for your linux server.
								<p className="text-red-300 text-xs w-full ml-4">
									See the link below to your server to ensure
									it's still live.
								</p>
							</li>
							<li className="mt-2">
								Your list of active sites does not include the
								listed website.
								<p className="text-red-300 text-xs w-full ml-4"></p>
							</li>
						</ul>
						<Text className="text-white font-bold text-lg">
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
						<div className="bg-black p-6 text-white rounded-lg">
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

export default DB_Update_Severe_Error

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
