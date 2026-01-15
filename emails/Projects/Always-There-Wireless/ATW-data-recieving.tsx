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

const tr = {
	borderTopStyle: "solid",
	borderTopWidth: "1px",
	borderColor: "#e6ebf1",
}

// const borderLeft = (depth:number) =>{return {
// 	// borderLeftStyle: "solid",
// 	// borderLeftWidth: `${depth * 2}px`,
// 	// borderColor: "darkgray",
//      background: "linear-gradient(to right, #000 0, #000 20px, #ffffff 0%)"
// }}
const borderLeft = (depth: number, position: string) => {
	// Define shadow properties based on the position
	let shadowX = "0"
	let shadowY = "0"
	if (position === "left") {
		shadowX = `-${depth * 2}px`
	} else if (position === "right") {
		shadowX = `${depth * 2}px`
	} else if (position === "top") {
		shadowY = `-${depth * 2}px`
	} else if (position === "bottom") {
		shadowY = `${depth * 2}px`
	}

	return {
		boxShadow: `${shadowX} ${shadowY} 0 rgba(0, 0, 0, 0.4)`,
	}
}

// Unresponsive - fixed width. Good starter Template

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ""

type emailProps = {
	firstName: string
	lastName: string
	email: string
	phone: string
	phoneCountryCode: string
	message: string
}

const data = {
	firstName: "Troy",
	lastName: "Wilkins",
	email: "test@test.com",
	phoneDetails: {
		phoneCountryCode: "US",
		phoneNo: "(465) 466-1650",
	},
	subscribed: true,
	address: {
		sameAsShipping: true,
		shipping: {
			addressLn1: "Wilkins",
			city: "luxenborge",
			state: "NH",
			zip: "53924",
		},
		delivery: {
			addressLn1: "Wilkins",
			city: "luxenborge",
			state: "NH",
			zip: "53924",
		},
	},
	name: "Billy bob",
	time: "7:04PM",
	date: "08/13/22",
	qualifications: "SNAP",
	DOB: "03/12/86",
	SSN: 4422,
	documentLink: "https://enrienrsi.com/image.jpg",
	pickedProduct: "x10",
}

const renderData = (
	data: Record<string, any>,
	depth: number = 0
): JSX.Element[] => {
	const rows: JSX.Element[] = []
	for (const key in data) {
		const isObject = typeof data[key] === "object"
		const bgColorClass = `${
			depth === 0 && isObject
				? "bg-white"
				: `bg-zinc-${100 + depth * 100} text-zinc-${400 + depth * 100}`
		}`

		if (isObject) {
			rows.push(
				<tr key={key}>
					<td
						style={borderLeft(depth + 1)}
						colSpan={2}
						className={`px-4 py-2 shadow text-left uppercase text-lg font-semibold border text-black ${bgColorClass}`}>
						{key}
					</td>
				</tr>
			)
			rows.push(...renderData(data[key], depth + 1)) // Increment the depth
		} else {
			rows.push(
				<tr key={key} className={`border-1 border-zinc-400`}>
					<td
						style={borderLeft(depth)}
						className={`px-4 py-2 font-semibold text-zinc-500 ${bgColorClass}`}>
						{key}
					</td>
					<td style={tr} className={`px-4 py-2 ${bgColorClass}`}>
						{data[key] === true
							? "TRUE"
							: data[key] === false
							? "FALSE"
							: data[key]}
					</td>
				</tr>
			)
		}
	}
	return rows
}

const renderedData = renderData(data)

export const ATWDataRecieving = ({
	firstName,
	lastName,
	email,
	phone,
	phoneCountryCode,
	message,
}: emailProps) => (
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
			<Preview>ATW: {data.name} - New Device Application!</Preview>
			<Body style={main} className="bg-[#f6f9fc] ">
				<Container className="pt-5 pb-12 mx-auto my-0 mb-16 bg-white">
					<Section className="px-12 py-0">
						<div className="flex flex-row justify-center align-middle">
							<div className="w-fit max-w-[55px]">
								<Img
									src={`https://i.ibb.co/B3HFVf0/FPTlogo.png`}
									width="55"
									height="55"
									alt="icon"
								/>
							</div>
							<div className="flex justify-center w-4/5 align-middle">
								<Text className="text-2xl tracking-wide text-gray-400">
									AlwaysThereWireless.com
								</Text>
							</div>
						</div>
						<Hr style={hr} />
						<Text className="flex ml-auto text-base text-amber-600 align-right ">
							{data.time} - {data.date}
						</Text>
						<Text
							style={paragraph}
							className="text-2xl text-gray-600">
							<span className="text-black capitalize">
								{data.name} -
							</span>{" "}
							New Device Request!:{" "}
						</Text>
						<Img
							src={
								data.pickedProduct === "x10"
									? "https://i.ibb.co/2s7QvyS/DIALNX10-G.png"
									: "https://i.ibb.co/KrpBzpK/DIALNX65.png"
							}
							width="400"
							height="400"
							alt="icon"
							className="flex mx-auto align-middle"
						/>

						<Hr style={hr} />
						<Text className="text-xl font-semibold text-[#8898aa]">
							Data Submitted:
						</Text>
						<div className="flex flex-col w-auto px-3 border-2 border-zinc-400 h-fit">
							<table
								className="border-gray-200 table-auto border-1 rounded-xl bg-[#fbfbfc]"
								style={table}>
								<thead className="bg-gray-200 rounded-t-lg">
									<tr
										className="text-xl bg-gray-200 text-zinc-600 bg-white py-2.5"
										style={{ borderRadius: "10px" }}>
										<th className="px-4 py-2 rounded-tl-lg ">
											Question
										</th>
										<th className="px-4 py-2 rounded-tr-lg">
											Response
										</th>
									</tr>
								</thead>
								<tbody className="text-center text-zinc-400">
									{/* {Object.keys(data).map((key, index) => (
										<tr key={index} className="w-full border-1 border-zinc-400">
											<td style={tr}  className="px-4 py-2 font-semibold border text-zinc-500">{key}</td>
											<td style={tr}  className="px-4 py-2 border">{data[key] === true ? "true" : data[key] === false ? "false" : data[key]}</td>
										</tr>
									))} */}

									{/* {Object.keys(data).map((key, index) => (
  
										<tr key={index} className="w-full border-1 border-zinc-400">
	
											<td style={tr} className="px-4 py-2 font-semibold border text-zinc-500">
												{key === "address" ? "Address" : key}
											</td>
	
											<td style={tr} className="px-4 py-2 border">
												{typeof data[key] === "object" ? (
													<table>
														<tbody>
															{Object.keys(data[key]).map((innerKey, innerIndex) => (
																<tr
																	key={innerIndex}
																	className={innerIndex % 2 === 0 ? "bg-gray-200" : "bg-gray-300"}>
																	<td style={tr} className="px-4 py-2 border text-zinc-500">
																		{innerKey}
																	</td>
																	<td style={tr} className="px-4 py-2 border">
																		{data[key][innerKey]}
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												) : data[key] === true ? (
													"TRUE"
												) : data[key] === false ? (
													"FALSE"
												) : (
													data[key]
												)}
											</td>
										
										</tr>
										// object
									))} */}
									{renderedData}
								</tbody>
							</table>

							{/* {typeof data[key] === "object" ? (
								<>
									<td
										style={tr}
										className="px-4 py-2 font-semibold border text-zinc-500 bg-zinc-300 border-b-[3] border-b-black border-b-2 border-solid">
										{key === "address" ? "Address" : key}
									</td>
									<table
										style={tr}
										className="px-4 py-2 border bg-zinc-300 border-b-[3] border-b-black border-b-2 border-solid">
										{typeof data[key] === "object" ? (
											<tbody>
												{Object.keys(data[key]).map((innerKey, innerIndex) => (
													<tr key={innerIndex} className={innerIndex % 2 === 0 ? "bg-gray-200" : "bg-gray-300"}>
														<td style={tr} className="px-4 py-2 border text-zinc-500">
															{innerKey}
														</td>
														<td style={tr} className="px-4 py-2 border">
															{data[key][innerKey]}
														</td>
													</tr>
												))}
											</tbody>
										) : data[key] === true ? (
											"TRUE"
										) : data[key] === false ? (
											"FALSE"
										) : (
											data[key]
										)}
									</table>
								</>
							) : null} */}
						</div>
						<Hr style={hr} />
						{/* <Text style={paragraph} className="text-[#8898aa] text-xs">
							This email was recieved because I recieved a form submission through my website's contact-me form. If you
							recieved this in error, please disregard. Your email will not be collected, sold, or solicited to. (someone may
							have misentered their email).
						</Text> */}
						<Link href="http://alwaystherewireless.com">
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

export default ATWDataRecieving

const main = {
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const hr = {
	borderColor: "#e6ebf1",
	margin: "20px 0",
}

const table = {
	display: "table",
	borderStyle: "solid",
	borderWidth: "1px",
	borderColor: "#000000",
}

const paragraph = {
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
}

const anchor = {
	color: "#0FB4CC",
}
