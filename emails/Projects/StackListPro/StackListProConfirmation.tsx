import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components"

interface StackListProConfirmationEmailProps {
	userFirstname?: string
	resetPasswordLink?: string
}

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	// dev code
} else {
	// production code
}
const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "https://stacklistPro.dev/"

// Update the Logo URL to the base URL before deployment.
const logoUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: ""

const recieptNumber = "123456789"

export const StackListProConfirmationEmail = ({
	userFirstname,
	resetPasswordLink,
}: StackListProConfirmationEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Dropbox reset your password</Preview>
			<Body style={main}>
				<Container style={container}>
					<Img
						src={`${logoUrl}/static/StackListLogo.png`}
						width="199"
						height="84"
						alt="StackListPro Logo"
					/>
					<Section>
						<Text style={text}>Thank you {userFirstname},</Text>
						<Text style={text}>
							Stacklist Pro, wouldn't exist without our amazing
							users. We are excited to have you on board!
						</Text>
						<Text style={text}>
							Below, you will find the links to your downloads.
							You can also access them within your StackListPro
							account at any time.
						</Text>
						<Button style={button} href={resetPasswordLink}>
							Download links
						</Button>
						<Text style={text}>
							You now also have access to your purchased stacks
							community forums.{" "}
						</Text>
						<Text style={smallText}>
							( Feel free to request help if you don't find fhat
							you need in the docs. )
						</Text>
						<Text style={text}>
							We are always actively working on making the docs
							more comprehensive and user-friendly.
						</Text>
						<Text style={text}>
							You can also download a copy of your payment receipt
							here:
						</Text>
						<Text style={text}>
							<Link
								style={anchor}
								href={`${baseUrl}reciepts/${recieptNumber}`}>
								Download Receipt
							</Link>
						</Text>
						<Text style={text}>
							We wish you the best possible outcome on your
							development journey. We hope our products are
							immensely usable and that you will consider
							expanding upon your Stacklist library the next time
							your StackList changes !
						</Text>
						<Text style={text}>- StackList Team</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

StackListProConfirmationEmail.PreviewProps = {
	userFirstname: "Alan",
	resetPasswordLink: "https://dropbox.com",
} as StackListProConfirmationEmailProps

export default StackListProConfirmationEmail

const main = {
	backgroundColor: "#18181B",
	padding: "10px 0",
}

const container = {
	backgroundColor: "#ffffff",
	border: "1px solid #f0f0f0",
	padding: "45px",
}

const text = {
	fontSize: "16px",
	fontFamily:
		"'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
	fontWeight: "300",
	color: "#404040",
	lineHeight: "26px",
	display: " flex",
}

const smallText = {
	fontSize: "12px",
	color: "##828282",
	fontWeight: "100",
	display: " flex",
	fontFamily:
		"'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
}

const button = {
	backgroundColor: "#000000",
	borderRadius: "4px",
	color: "#fff",
	fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	width: "210px",
	padding: "14px 7px",
}

const anchor = {
	textDecoration: "underline",
}
