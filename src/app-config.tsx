export const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 5
export const MAX_UPLOAD_IMAGE_SIZE = 1024 * 1024 * MAX_UPLOAD_IMAGE_SIZE_IN_MB

const APP_CONFIG: appConfigType = {
	mode: "live",
	companyName: "MichaelMartell.com",
	applicationName: "MichaelMartell.com",
	phoneNo: "(651) 417-2840",
	devMode: false,
	isUnderDevelopment: true,
	protectedRoutes: ["/purchases", "/dashboard"],
	afterLoginUrl: "/dashboard",
	adminContext: {
		adminEmail: "240designworks@gmail.com",
	},
	siteContent: {
		widgets: {
			ChatBot: {
				supportStaff: [
					{
						name: "Michael Martell",
						photo: "/images/michael-martell.jpg",
					},
				],
				socialMedia: [
					{
						name: "Twitter",
						url: "https://twitter.com/240designworks",
						icon: "https://uploadthing.com/f/1674332432204-twitter",
					},
				],
			}
		}
	},
	adminLinks: {
		PostHog: "'https://uploadthing.com/dashboard/gold240sx-personal-team'",
		UploadThing: "'https://uploadthing.com/dashboard/gold240sx-personal-team'",
		Sentry: "https://gold240sx.sentry.io/settings/projects/portfolio_2025_payload3/"
	},
	socials: {
		linkedin: "https://www.linkedin.com/in/martell01/",
		github: "https://github.com/Gold240sx",
		x: "https://x.com/240designworks",
		dailyDev: "https://app.daily.dev/gold240sx",
		stackOverflow: "https://stackoverflow.com/users/16441693/michael-martell",
		buyMeACoffee: "https://ko-fi.com/michaelmartell",
	},
	storeConfig: {
		CURRENCY: "usd",
		// Set your amount limits: Use float for decimal currencies and
		// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
		MIN_AMOUNT: 10.0,
		MAX_AMOUNT: 5000.0,
		AMOUNT_STEP: 5.0,
	},
	emails: {
		TOKEN_LENGTH: 32,
		TOKEN_TTL: 1000 * 60 * 5, // 5 min
		VERIFY_EMAIL_TTL: 1000 * 60 * 60 * 24 * 7, // 7 days
	},
	uploads: {
		MAX_UPLOAD_IMAGE_SIZE_IN_MB,
		MAX_UPLOAD_IMAGE_SIZE,
	}
}

export default APP_CONFIG


type appConfigType = {
	mode: "comingSoon" | "maintenance" | "live"
	companyName: string
	applicationName: string
	phoneNo: string
	devMode: boolean
	isUnderDevelopment?: boolean
	adminContext?: {
		adminEmail?: string
	}
	adminLinks: {
		PostHog: string
		UploadThing: string
		Sentry: string
	}
	protectedRoutes: string[]
	afterLoginUrl: string
	uploads: {
		MAX_UPLOAD_IMAGE_SIZE_IN_MB: number
		MAX_UPLOAD_IMAGE_SIZE: number
	}
	emails: {
		TOKEN_LENGTH: number
		TOKEN_TTL: number
		VERIFY_EMAIL_TTL: number
	}
	socials: {
		linkedin: string
		github: string
		x: string
		dailyDev: string
		stackOverflow: string
		buyMeACoffee: string
	}
	siteContent: {
		widgets: {
			ChatBot: {
				supportStaff: {
					name: string
					photo: string
				}[]
				socialMedia: {
					name: string
					url: string
					icon: string
				}[]
			}
		}
	}	
	storeConfig: {
		CURRENCY: string
		MIN_AMOUNT: number
		MAX_AMOUNT: number
		AMOUNT_STEP: number
	}
}