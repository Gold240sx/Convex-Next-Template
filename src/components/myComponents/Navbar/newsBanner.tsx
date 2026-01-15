"use client"

import Marquee from "react-fast-marquee"
import { motion } from "framer-motion"

type NewsBannerType = {
	props: {
		newsBanner: {
			newsBannerText: string | string[]
			newsBannerLink: string
			newsBannerOpen: boolean
			hiddenOnHome: boolean
			newsBannerButtonText: string
		}
	}
}

const NewsBanner = ({ props }: NewsBannerType) => {
	const {
		newsBannerText,
		newsBannerLink,
		newsBannerButtonText,
		newsBannerOpen,
		hiddenOnHome,
	} = props.newsBanner
	// console.log("news banner", props.newsBanner)

	const renderBanner = () => {
		if (Array.isArray(newsBannerText)) {
			return (
				<div className="h-fit flex w-full">
					{newsBannerText.map((newsBannerText, index) => (
						<Marquee
							pauseOnHover={true}
							key={index}
							className="w-full flex justify-evenly gap-20">
							<p className="text-white group-hover:text-white">
								{newsBannerText}
							</p>
							<p className="text-white py-10s">
								{newsBannerText}
							</p>
							<p className="text-white py-10s">
								{newsBannerText}
							</p>
						</Marquee>
					))}
				</div>
			)
		} else {
			return (
				<div className="h-fit flex items-center w-full">
					<Marquee pauseOnHover={true} className="w-full">
						<div className="text-zinc-600 group-hover:text-white w-full flex gap-4 -skew-x-6">
							{newsBannerText}
							<a
								className="underline underline-offset-2 text-teal-500 hover:-amber-400 p-0.5 px-8 opacity-60 hover:opacity-100"
								href={newsBannerLink}
								target="_blank">
								<p>
									{newsBannerButtonText
										? newsBannerButtonText
										: "Let's Go!"}
								</p>
							</a>
						</div>
					</Marquee>
				</div>
			)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="h-fit bg-black flex w-full py-1 group">
			<div className="text-white py-10s w-full">{renderBanner()}</div>
		</motion.div>
	)
}

export default NewsBanner
