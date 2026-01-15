//@ts-nocheck
import {
	Body,
	Button,
	Container,
	Column,
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

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ""
const email = "mrBanks@gmail.com"

export const SubscriberWelcomeEmail = () => (
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
				You'll now recieve device and offer notifications from Always
				There Wireless!
			</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={box}>
						<div className="flex flex-row justify-center align-middle">
							<div className="w-fit max-w-[55px] flex">
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
						<Text style={paragraph}>Hey {email}</Text>
						<Text style={paragraph}>
							Thanks for subscribing to our users list! We
							absolutely love providing people with awesome
							devices we really hope you love! If you havn't yet
							submitted an application, consider bookmarking our
							website for when you are ready!
						</Text>
						<Text style={paragraph}>
							Click on the 'Claim your device' button on the home
							page, and one of our associates will verify and
							reach back out to you with securing your device.
						</Text>
						<Button
							pX={10}
							pY={10}
							style={button}
							href="https://alwaystherewireless.com/">
							Always There Wireless
						</Button>
						<Hr style={hr} />
						<Text style={paragraph}>
							We hope we lived up to your expectations. You can
							also reach out to our support team as well if need
							be. (link on homepage of website within the FAQ
							section)
						</Text>
						<Text style={paragraph}>
							Please also consider helping us grow, by telling
							your friends, family,... heck, grab a random person
							on the street (don't actually do this). Believe it
							or not, the traffic gained helps us continue doing
							what we're doing. Share this email or the link below
							with a friend or on social media! We really
							appreciate any and all support!
						</Text>
						<Text style={paragraph}>
							Thanks for being awesome and we hope you have an
							incredible week!
						</Text>

						<Text style={paragraph}>— The ATW team</Text>
						<Hr style={hr} />
						{/* <Text style={footer}>Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080</Text> */}
						<Text style={footer}>
							<Link
								href="https://www.alwaystherewireless.com/"
								className="font-md">
								https://www.alwaystherewireless.com/
							</Link>
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
)

export default SubscriberWelcomeEmail

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px 0 48px",
	marginBottom: "64px",
}

const box = {
	padding: "0 48px",
}

const hr = {
	borderColor: "#e6ebf1",
	margin: "20px 0",
}

const paragraph = {
	color: "#525f7f",

	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
}

const anchor = {
	color: "#556cd6",
}

const button = {
	backgroundColor: "#656ee8",
	borderRadius: "5px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	width: "100%",
}

const footer = {
	color: "#8898aa",
	fontSize: "12px",
	lineHeight: "16px",
}
