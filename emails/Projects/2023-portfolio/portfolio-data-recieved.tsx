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

export const DataRecieved = () => (
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
				Michael-Martell.com - You're email has been recieved!
			</Preview>
			<Body style={main} className="bg-[#f6f9fc]">
				<Container className="pt-5 pb-12 mx-auto my-0 mb-16 bg-white">
					<Section className="px-12 py-0">
						<div className="flex flex-row justify-center align-middle">
							<div className="w-fit">
								<Img
									src={`${baseUrl}/static/assets/mac.png`}
									width="55"
									height="55"
									alt="icon"
								/>
							</div>
							<div className="flex justify-center w-4/5 align-middle">
								<Text className="text-2xl tracking-wide text-gray-400">
									MICHAEL-MARTELL.com
								</Text>
							</div>
						</div>
						<Hr style={hr} />
						<Text style={paragraph} className="text-gray-600">
							Your form submission has successfully been recieved!
						</Text>
						<Text style={paragraph} className="text-zinc-400">
							Thank you for reaching out! I treat every email as a
							priority and am excited to begin chatting. I will
							get back to you as soon as I can!
						</Text>
						<Text style={paragraph} className="text-zinc-400">
							Please save my email:{" "}
							<span className="text-sky-600">
								240designworks@gmail.com
							</span>{" "}
							to prevent any missed communication, and if
							applicable, mark as important.
						</Text>
						<Text style={paragraph} className="text-zinc-400">
							Feel free to check out my website and social media
							accounts below. I am always posting new content.
						</Text>
						<Text style={paragraph} className="text-zinc-400">
							— Michael Martell
						</Text>
						<Button
							className="bg-[#145A6E] rounded-lg text-white text-base text-bold text-center block w-1/2 mx-auto mt-6"
							pX={10}
							pY={10}
							href="http://www.michael-martell.com">
							My Website
						</Button>
						<Hr style={hr} />
						<Text className="text-xl font-semibold text-[#8898aa]">
							Your Form Submission:
						</Text>
						<div className="flex flex-col w-auto px-3 border-2 border-zinc-400 h-fit">
							<Text className="">Contact Form Type:</Text>
							<table className="border-gray-200 table-auto border-1 rounded-xl">
								<thead className="rounded-t-lg">
									<tr className="bg-gray-200 rounded-t-lg text-zinc-600">
										<th className="px-4 py-2 ">Question</th>
										<th className="px-4 py-2 ">Response</th>
									</tr>
								</thead>
								<tbody className="text-center text-zinc-400">
									<tr>
										<td className="px-4 py-2 font-semibold border text-zinc-500">
											Reason
										</td>
										<td className="px-4 py-2 border">
											Description
										</td>
									</tr>
									<tr>
										<td className="px-4 py-2 font-semibold border text-zinc-500">
											Reason
										</td>
										<td className="px-4 py-2 border">
											Description
										</td>
									</tr>
									<tr>
										<td className="px-4 py-2 font-semibold border text-zinc-500">
											Reason
										</td>
										<td className="px-4 py-2 border">
											Description
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<Hr style={hr} />
						<Text
							style={paragraph}
							className="text-[#8898aa] text-xs">
							This email was recieved because I recieved a form
							submission through my website's contact-me form. If
							you recieved this in error, please disregard. Your
							email will not be collected, sold, or solicited to.
							(someone may have misentered their email).
						</Text>
						<Link href="http://www.michael-martell.com">
							<Text style={anchor} className="text-xs ">
								Michael-Martell.com
							</Text>
						</Link>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
)

export default DataRecieved

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
