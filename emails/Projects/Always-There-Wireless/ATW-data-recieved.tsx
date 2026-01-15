import { Body, Button, Column, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import * as React from "react"
import { Tailwind } from "@react-email/tailwind"

// Unresponsive - fixed width. Good starter Template

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""

export const ATWDataRecieved = () => (
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
			<Preview>ATW - New Applicant!</Preview>
			<Body style={main} className="bg-[#f6f9fc]">
				<Container className="pt-5 pb-12 mx-auto my-0 mb-16 bg-white">
					<Section className="px-12 py-0">
						<div className="flex flex-row justify-center align-middle">
							<div className="w-fit">
								<Img src={`https://i.ibb.co/B3HFVf0/FPTlogo.png`} width="55" height="55" alt="icon" />
							</div>
							<div className="flex justify-center w-4/5 align-middle">
								<Text className="text-2xl tracking-wide text-gray-400">AlwaysThereWireless.com</Text>
							</div>
						</div>
						<Hr style={hr} />
						<Text style={paragraph} className="text-gray-600">
							Your Application has been submitted!
						</Text>
						<Text style={paragraph} className="text-zinc-400">
							Thank you for submitting an application with us! We have recieved your data and will be processing your
							application and get back with you shortly!
						</Text>
						<Text style={paragraph} className="text-zinc-400">
							If you have any questions, Please reach out to us by email:{" "}
							<span className="text-sky-600">ohioacppts@gmail.com</span> to prevent any missed communication, and if
							applicable, mark as important.
						</Text>

						<Hr style={hr} />
						<Text className="text-xl font-semibold text-[#8898aa]">Data Submitted:</Text>
						<div className="flex flex-col w-auto px-3 border-2 border-zinc-400 h-fit">
							<table className="border-gray-200 table-auto border-1 rounded-xl">
								<thead className="rounded-t-lg">
									<tr className="bg-gray-200 rounded-t-lg text-zinc-600">
										<th className="px-4 py-2 ">Question</th>
										<th className="px-4 py-2 ">Response</th>
									</tr>
								</thead>
								<tbody className="text-center text-zinc-400">
									<tr>
										<td className="px-4 py-2 font-semibold border text-zinc-500">Reason</td>
										<td className="px-4 py-2 border">Description</td>
									</tr>
									<tr>
										<td className="px-4 py-2 font-semibold border text-zinc-500">Reason</td>
										<td className="px-4 py-2 border">Description</td>
									</tr>
									<tr>
										<td className="px-4 py-2 font-semibold border text-zinc-500">Reason</td>
										<td className="px-4 py-2 border">Description</td>
									</tr>
								</tbody>
							</table>
						</div>
						<Hr style={hr} />
						{/* <Text style={paragraph} className="text-[#8898aa] text-xs">
							This email was recieved because I recieved a form submission through my website's contact-me form. If you
							recieved this in error, please disregard. Your email will not be collected, sold, or solicited to. (someone may
							have misentered their email).
						</Text> */}
						<Link href="http://www.michael-martell.com">
							<Text style={anchor} className="text-xs ">
								AlwaysThereWireless.com
							</Text>
						</Link>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
)

export default ATWDataRecieved

const main = {
	fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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
