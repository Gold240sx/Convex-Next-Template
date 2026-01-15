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
import SupportImage from "@/assets/defaults/support.png"
import Copyright from "@/components/myComponents/Copyright"
import { ReplaceSpacesWithPercentages } from "@/functions/replaceSpacesWithPercentages"
import getCurrentTimeAndDate, {
	currentTimeAndDate,
} from "@/functions/currentTimeAndDate"

const siteName = "Davids Garage Pro"
const quickReplyCouponText = `Thanks for submitting a request for more information to David's Garage Pro! Here's the coupon for 10% off your next service with us! Click here to download:`
const smsImageLink = `https://i.ibb.co/DLtw2GB/DGP10-Coupon.png`

const tr = {
	borderTopStyle: "solid",
	borderTopWidth: "1px",
}

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

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ""

const data = {
	email: "test@test.com",
	phoneNo: "(473) 842-3819",
	firstName: "Troy",
	lastName: "Wilkins",
	prefferedContact: "text", // or "email" or "phone"
	message:
		"Hi, I'm having issues with my account. I tried resetting my password but it's not working. Can you help me? I even tried restarting my computer, calling dell support, and was scammed by some thieving telephone scammers. All i need is 2 million dollars in a briefcase and I'll be on my way. Thanks!",
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
}

const socialLinks = [
	{
		name: "Meta",
		href: "https://www.facebook.com/UrgentGarageDoor/",
		iconLink: "https://i.ibb.co/rGqY15X/Meta-White.png",
		icon: () => (
			<svg fill="currentColor" viewBox="0 0 32 32">
				<path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11" />
			</svg>
		),
	},
	{
		name: "X",
		href: "https://x.com/DavidsGaragePro",
		iconLink: "https://i.ibb.co/TvMTP1V/Twitter-White.png",
		icon: (props: any) => (
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
			</svg>
		),
	},
	{
		name: "Google Business",
		href: "https://www.google.com/search?q=David's%20Urgent%20Garage%20Door",
		iconLink: "https://i.ibb.co/hWyxdx3/Google-White.png",
		icon: (props: any) => (
			<svg fill="currentColor" viewBox="0 0 1024.00 1024.00">
				<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm167 633.6C638.4 735 583 757 516.9 757c-95.7 0-178.5-54.9-218.8-134.9C281.5 589 272 551.6 272 512s9.5-77 26.1-110.1c40.3-80.1 123.1-135 218.8-135 66 0 121.4 24.3 163.9 63.8L610.6 401c-25.4-24.3-57.7-36.6-93.6-36.6-63.8 0-117.8 43.1-137.1 101-4.9 14.7-7.7 30.4-7.7 46.6s2.8 31.9 7.7 46.6c19.3 57.9 73.3 101 137 101 33 0 61-8.7 82.9-23.4 26-17.4 43.2-43.3 48.9-74H516.9v-94.8h230.7c2.9 16.1 4.4 32.8 4.4 50.1 0 74.7-26.7 137.4-73 180.1z"></path>
			</svg>
		),
	},
	{
		name: "Youtube",
		href: "https://www.youtube.com/@DavidsGaragePro",
		iconLink: "https://i.ibb.co/mSgT3gz/Instagram-White.png",
		icon: (props: any) => (
			<svg viewBox="0 0 576 512" fill="currentColor">
				<path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
			</svg>
		),
	},
	{
		name: "Instagram",
		href: "https://www.instagram.com/urgentgaragedoor/",
		iconLink: "https://i.ibb.co/JK8S7TW/Youtube-White.png",
		icon: (props: any) => (
			<svg viewBox="0 0 448 512" fill="currentColor">
				<path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
			</svg>
		),
	},
]

const renderData = (
	data: Record<string, any>,
	depth: number = 0
): JSX.Element[] => {
	const rows: JSX.Element[] = []
	for (const key in data) {
		const isObject = typeof data[key] === "object"
		const bgColorClass = `${
			depth === 0 && isObject
				? "bg-black"
				: `bg-zinc-${
						900 + depth * 100
				  } border-zinc-800 border-t text-zinc-${200 + depth * 100}`
		}`

		if (isObject) {
			rows.push(
				<tr key={key}>
					<td
						style={borderLeft(depth + 1)}
						colSpan={2}
						className={`px-4 py-2 shadow text-left uppercase text-lg border-zinc-800 border-t font-semibold border text-white ${bgColorClass}`}>
						{key}
					</td>
				</tr>
			)
			rows.push(...renderData(data[key], depth + 1)) // Increment the depth
		} else {
			rows.push(
				<tr key={key} className={`border-1 border-zinc-800 border-t `}>
					<td
						style={borderLeft(depth)}
						className={`px-4 py-2 font-semibold border-t-zinc-800 text-zinc-500 ${bgColorClass}`}>
						{key}
					</td>
					<td
						style={tr}
						className={`px-4 py-2 border-t-zinc-800 ${bgColorClass}`}>
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
const DateAndTime = getCurrentTimeAndDate()

const DGPDataRecieved = ({
	firstName,
	lastName,
	userType,
	email,
	phoneNo,
	subscribed,
	address,
	prefferedContact,
	city,
	state,
	zip,
	send_more_info,
	maintenanceNeeded,
	installationNeeded,
	repairsNeeded,
	inspectionNeeded,
	upgradesNeeded,
}: DataRecievingProps) => {
	const newRenderedDataForEmail = renderData({
		Name: firstName && lastName ? `${firstName} ${lastName}` : null,
		"First Name": firstName,
		"Last Name": lastName,
		"Date And Time": `${DateAndTime.time} - ${DateAndTime.date}`,
		UserType: userType,
		Email: email,
		"Phone Number": phoneNo,
		Address: {
			// delivery: {
			Address: address,
			City: city,
			State: state,
			Zip: zip,
			// },
		},
		"Subscribed?": send_more_info,
		"Maintenance Needed?": maintenanceNeeded ? maintenanceNeeded : null,
		"Installation Needed?": installationNeeded ? installationNeeded : null,
		"Repairs Needed?": repairsNeeded ? repairsNeeded : null,
		"Inspection Needed?": inspectionNeeded ? inspectionNeeded : null,
		"Upgrades Needed?": upgradesNeeded ? upgradesNeeded : null,
	})

	return (
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
			<Html style={main} className="m-0 p-0">
				<Head />
				<Preview>David's Garage Pro - Service Inquiry</Preview>
				<Body
					style={main}
					className="bg-zinc-900 md:pt-6 pb-0 w-full max-w-screen">
					<Container className="mx-auto my-0 mb-9 md:mb-16 bg-zinc-800">
						<Img
							src={
								"https://i.ibb.co/bLw35rC/David-s-Garage-Logo2-3.png"
							}
							alt="Support Request"
							className="w-full h-auto"
						/>

						{/* <Section className=" py-0 mb-16">
							<Text className="flex ml-auto px-6 text-base text-amber-400 align-right ">
								{data.time} - {data.date}
							</Text>
							<Text
								style={paragraph}
								className="text-2xl px-6 text-gray-400">
								<span className="text-white capitalize">
									{data.name} -
								</span>{" "}
								New Job Inquiry!:{" "}
							</Text>
							<Section className="p-6 pb-0 w-full px-4">
								<div className="p-4 pb-0 bg-black/50 ">
									<Img
										src={
											"https://i.ibb.co/McW5ZL9/blessing.png"
										}
										width="100%"
										height="auto"
										alt="icon"
									/>
								</div>
							</Section>

							<div className="flex gap-4 my-8 mx-4 md:mx-auto w-fit mb-12">
								<Button
									className={`text-zinc-800 text-center ${
										data.prefferedContact === "email"
											? "bg-amber-400"
											: "bg-zinc-500"
									}`}
									href={`${data.email}`}
									style={{
										borderRadius: "10px",
									}}>
									<span className="flex font-thin my-auto mt-0.5 md:py-4 md:px-5">
										Reply by Email
									</span>
								</Button>
								<Button
									className={`text-zinc-800 text-center justify-center flex ${
										data.prefferedContact === "text"
											? "bg-amber-400"
											: "bg-zinc-500"
									}`}
									href={`sms:${data.phoneNo}`}
									style={{
										borderRadius: "10px",
									}}>
									<span className="flex my-auto font-thin h-fit mt-0.5 md:mt-0 md:py-4 md:px-5">
										Reply by Text
									</span>
								</Button>
								<Button
									className={`text-zinc-800 text-center ${
										data.prefferedContact === "phone"
											? "bg-amber-400"
											: "bg-zinc-500"
									}`}
									href={`tel:${data.phoneNo}`}
									style={{
										borderRadius: "10px",
									}}>
									<span className="flex font-thin my-auto h-fit mt-0.5 md:mt-0 md:py-4 md:px-5">
										Reply by Phone
									</span>
								</Button>
							</div>

							<div>
								<Button
									className={`text-zinc-800 text-center px-6 w-fit mx-auto justify-center flex ${
										data.prefferedContact === "text"
											? "bg-amber-400"
											: "bg-zinc-500"
									}`}
									href={`sms:${
										data.phoneNo
									}?body=${ReplaceSpacesWithPercentages(
										quickReplyCouponText
									)}${smsImageLink}`}
									style={{
										borderRadius: "10px",
									}}>
									<span className="flex my-auto text-xl py-4 w-full md:w-fit h-fit mt-0.5 md:mt-0 md:px-5">
										Send Coupon Reminder
									</span>
								</Button>
							</div>

							<Text className="text-5xl font-thin text-[#8898aa] mt-10">
								Data Submitted:
							</Text>
							<div className="flex flex-col w-auto px-3 border-2 border-zinc-600 h-fit">
								<table
									className="border-gray-800 table-auto border-1  bg-[#0d0d0d]"
									style={table}>
									<thead className="bg-amber-400">
										<tr
											className="text-xl bg-amber-400 text-black uppercase py-2.5"
											style={{ borderRadius: "10px" }}>
											<th className="px-4 py-2 tracking-widest">
												Question
											</th>
											<th className="px-4 py-2 tracking-widest">
												Response
											</th>
										</tr>
									</thead>
									<tbody className="text-center text-zinc-400">
										{newRenderedDataForEmail.length > 0
											? newRenderedDataForEmail
											: renderedData}
									</tbody>
								</table>
							</div>
						</Section> */}

						{/* <Section className=" py-0">
							<div className="flex flex-col lg:flex-row justify-between pb-4 md:pb-0 bg-black">
								<Link
									href="http://davidsgarage.pro"
									className="text-center flex justify-center lg:justify-end items-center align-middle md:gap-4">
									<Img
										src="https://i.ibb.co/Mczg891/Davids-Garage-Badge.png"
										alt="DavidsGarage.pro"
										className="w-12 h-14 mt-4"
									/>
									<div className="flex flex-col gap-0 -mt-3">
										<Text className="text-4xl p-0 m-0 whitespace-nowrap uppercase font-semibold ml-4 mt-8 md:ml-0 text-white">
											David's{" "}
											<span className="hidden md:inline">
												Garage.pro
											</span>
										</Text>
										<Text className="text-base mr-auto ml-[18px] md:hidden italic uppercase p-0 m-0 text-zinc-500">
											Garage.pro
										</Text>
									</div>
								</Link>
								<Section>
									<div className="flex flex-col lg:flex-row  justify-end items-center">
										<Text className="text-white text-xl">
											Follow us on social media!:{" "}
										</Text>
										<div className="flex">
											{socialLinks.map((link, index) => (
												<Link
													key={index}
													href={link.href}
													className="mx-2">
													{link.icon({
														className:
															"w-8 h-8 md:w-6 md:h-6 text-zinc-400",
													})}
												</Link>
											))}
										</div>
									</div>
								</Section>
							</div>
						</Section> */}

						<Section className="px-12 py-0">
							<div className="flex flex-row justify-center align-middle">
								<div className="flex justify-end text-end w-full align-end">
									<Text className="text-lg tracking-wide text-gray-400">
										💻 DavidsGarage.pro
									</Text>
								</div>
							</div>
							<Text
								style={paragraph}
								className="text-white text-2xl">
								Your Quote has been recieved by our team!
							</Text>
							<Text style={paragraph} className="text-gray-200 ">
								Thank you for submitting a support request with
								us! We have recieved your job details and will
								get back to you shortly! Please be aware that
								delays may occur on Saturdays, and peak times.
							</Text>
							<Text style={paragraph} className="text-zinc-400">
								If you have any questions, Please reach out to
								us by email:
							</Text>
							<Link href="mailto:info@davidsgarage.pro">
								<div className="flex gap-4 items-center">
									<Img
										src="https://i.ibb.co/7gR2Fkk/584856bce0bb315b0f7675ad.png"
										alt="Email Us"
										className="ml-2 grayscale hidden md:inline"
										width={40}
										height={40}
									/>
									<Text className="text-amber-400 text-2xl md:text-3xl md:my-4 pl-2">
										{" "}
										info@davidsgarage.pro
									</Text>{" "}
								</div>
							</Link>
							<Hr style={hr} className="mt-12" />
						</Section>

						<Section className="px-6 md:px-12 py-0">
							<Text className="text-xl font-semibold text-zinc-200">
								As Promised, here's your coupon for 10% off of
								your next service:
							</Text>
							<div className="flex flex-col justify-between gap-8 bg-amber-600 border-white border-dashed border-4 p-6 min-h-24">
								<h3 className="text-5xl text-center text-white font-semibold align-middle flex my-auto">
									10% off of installation services
								</h3>
								<div className="flex flex-col gap-4 -mb-3 bg-white h-12 w-full md:w-fit md:mx-auto md:px-4">
									<Text className="text-4xl -translate-y-3 text-center text-zinc-700 font-semibold">
										10OFFINSTALL
									</Text>
								</div>
								<p className="text-red-200 font-thin text-sm text-center">
									*Must be completed and presented prior to
									project start. Coupon valid only on
									full-price service. This incentive cannot be
									used in conjunction with any other offers.
								</p>
							</div>
							<Text className="text-xl font-semibold text-zinc-200">
								Please present this coupon prior to the project
								start.
							</Text>
						</Section>

						<Section className="px-6 md:px-12 py-0">
							<Text className="text-zinc-400">
								To prevent any missed communication, mark this
								email as important to prevent missing any
								upcoming emails.
							</Text>
							<Text className="text-zinc-400">
								We do not sell, distribute or profit off any
								information provided to us or submitted to our
								site.
							</Text>
							<Text className="text-white tracking-wider font-thin text-3xl mx-auto flex text-center w-2/3 my-12 text-balance">
								We appreciate your business and look forward to
								serving you!
							</Text>
						</Section>

						<Section className="px-8 -mt-6">
							<Hr style={hr} />
							<Text
								style={paragraph}
								className="text-zinc-400 text-xs">
								Recieved this email in error?{" "}
							</Text>
							<Text
								style={paragraph}
								className="text-zinc-400 text-xs">
								If you believe you received this email by
								mistake, or if you no longer wish to receive
								these emails, you can
								<Link
									className="text-amber-400/60 ml-4"
									href={`davidsgarage.pro/unsubscribe?email=${data.email}&name=${data.name}}`}>
									Unsubscribe here
								</Link>
								.
							</Text>
						</Section>

						<Section id="footer" className="bg-black">
							<div className="flex flex-col lg:flex-row justify-between pb-4 md:pb-0">
								<Link
									href="http://davidsgarage.pro"
									className="text-center flex justify-center lg:justify-end items-center align-middle md:gap-4">
									<Img
										src="https://i.ibb.co/Mczg891/Davids-Garage-Badge.png"
										alt="DavidsGarage.pro"
										className="w-12 h-14 mt-4"
									/>
									<div className="flex flex-col gap-0 -mt-3">
										<Text className="text-4xl p-0 m-0 whitespace-nowrap uppercase font-semibold ml-4 mt-8 md:ml-0 text-white">
											David's{" "}
											<span className="hidden md:inline">
												Garage.pro
											</span>
										</Text>
										<Text className="text-base mr-auto ml-[18px] md:hidden italic uppercase p-0 m-0 text-zinc-500">
											Garage.pro
										</Text>
									</div>
								</Link>
								<Section>
									<div className="flex flex-col lg:flex-row  justify-end items-center">
										<Text className="text-white text-xl">
											Follow us on social media!:{" "}
										</Text>
										<div className="flex justify-center items-center">
											{socialLinks.map((link, index) => (
												<Link
													key={index}
													href={link.href}
													className="mx-2">
													{/* {link.icon({
														className:
															"w-8 h-8 md:w-6 md:h-6 text-zinc-400",
													})} */}
													<Img
														src={link.iconLink}
														alt={link.name}
														className="w-8 h-auto max-h-8 md:w-6 my-auto flex text-zinc-400"
													/>
												</Link>
											))}
										</div>
									</div>
								</Section>
							</div>
							<div className="flex items-center w-full justify-center">
								<span className="text-[1.3rem] font-extralight text-zinc-600">
									&copy;
								</span>{" "}
								<Link
									href="https://www.michaelmartell.dev"
									className="w-fit group no-underline"
									target="_blank">
									<p>
										<span className="tracking-tighter font-semibold no-underline text-zinc-600 mr-1">
											2024
										</span>
										<span className="group-hover:text-sky-200 text-zinc-200 font-normal text-base tracking-widest group-hover:underline underline-offset-2">
											michaelmartell.dev
										</span>
									</p>
								</Link>
								<p className="text-[12px] pl-1 whitespace-nowrap text-end mt-4 ml-2 tracking-tighter text-zinc-500">
									Developed with
								</p>
								<p className="text-[12px] text-end  -translate-y-1 text-zinc-500"></p>
								<Img
									src="https://i.ibb.co/mCVWNqM/nextjs-white.png"
									className="ml-2 mt-1"
									alt="Next.js Logo"
									width={40}
									height={24}
								/>
							</div>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}

export default DGPDataRecieved

const main = {
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	padding: "0",
	margin: "0",
}

const body = {
	padding: "0",
	margin: "0",
}

const hr = {
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
