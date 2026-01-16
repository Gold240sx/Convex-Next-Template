"use client"
import Cookie from "@/assets/media/defaults/cookie.svg"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shadcn/accordion"
import { Button } from "@/shadcn/button"
import SiteParams from "@/data/_SiteParams"
import { useLocalStorage } from "@/context/providers/localStorageContext"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import CookiesForm from "./CookiesForm"

const CookiesPopup = () => {
	const {
		theme,
		updateTheme,
		cookieJar,
		updateCookieJar,
		prefersReducedMotion,
		updatePrefersReducedMotion,
	} = useLocalStorage()
	const [cookies, setCookies] = useState(cookieJar)
	const [showPopup, setShowPopup] = useState(true)
	const [showPopupDetails, setShowPopupDetails] = useState(false)
	const cookieAccordianRef = useRef<HTMLDivElement | null>(null)
	const acceptAllBtnRef = useRef<HTMLButtonElement | null>(null)

	const { SiteContent } = SiteParams
	const cookieParams = SiteContent.pages.Cookies.cookies
	const { cookieShortPolicyDescription } = cookieParams

	const cookiesFormerlySaved = cookies.cookiesSaved
	// console.log("cookiesFormerlySaved", cookiesFormerlySaved)

	useLayoutEffect(() => {
		// Focus the accept all button when the component mounts
		acceptAllBtnRef.current?.focus()
		updateCookieJar(cookies)
		if (cookiesFormerlySaved) {
			document.body.classList.remove("cookiesAlert--active")
		}
	}, [cookies]) // eslint-disable-line react-hooks/exhaustive-deps

	const closePopup = () => {
		document.body.classList.remove("cookiesAlert--active")
		setShowPopup(false)
	}

	return (
		<div id="cookies-popup" key="cookie">
			{!cookiesFormerlySaved && (
				<div
					className={`${
						showPopup
							? "fixed bottom-0 right-0 z-50 left-0 overflow-hidden backdrop-blur-sm select-none bg-white/30 dark:bg-black/30 h-screen w-screen max-h-screen"
							: ""
					}`}>
					{showPopup && (
						<motion.div
							id="cookies-alert"
							initial={{ x: "100%", opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: "100%", opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="fixed w-full p-4 pointer-events-auto h-fit bottom-2 right-0 z-20 overscroll-none items-end lg:max-w-[700px] max-h-[80vh] ease-in-out duration-300 transition-all">
							<div
								className={`${
									showPopupDetails ? "ml-auto" : "ml-8"
								} bg-zinc-800 relative dark:bg-zinc-300  lg:max-w-[60dvw]  inset-0 rounded-2xl w-fit py-4 ml-8 mt-auto flex flex-col shadow-2xl duration-300 ease-in-out transition-all`}>
								<div className="absolute top-2 right-2">
									{!showPopupDetails && (
										<div
											id="close-cookie-popup"
											className="text-zinc-200 hover:text-white dark:text-zinc-800">
											<button
												onClick={() => closePopup()}>
												<IoClose className="text-white absolute right-2 top-2 items-center text-3xl m-1 mt-1 hover:border-zinc-200 hover:text-white" />
											</button>
										</div>
									)}
								</div>

								<div className=" h-fit w-fit ease-in-out transition-all duration-300">
									{!showPopupDetails && (
										<div
											id="cookie-pop-up-intro"
											className="flex gap-4 px-4 flex-row w-fit ease-in-out-duration-300 transition-all grow">
											<Image
												src={Cookie}
												alt="cookie"
												width={50}
												height={50}
												className="w-16 h-16 scale-[2.5] translate-x-5 sm:translate-y-0 hidden sm:block"
											/>
											<div className="gap-4 w-fit ease-in-out-duration-300 transition-all">
												<h3 className="text-white dark:text-zinc-800 text-3xl text-center pb-4 md:hidden">
													Cookies
												</h3>
												<p className="text-white sm:pl-24 md:pr-10 w-full dark:text-zinc-800 text-center">
													This site collects anonymous
													data and stores it on your
													computer to improve user
													experience.
												</p>
												<div
													id="cookie-button-bar"
													className="flex mt-6 sm:pl-24 gap-4 items-end flex-wrap">
													<Button
														ref={acceptAllBtnRef}
														variant="link"
														onClick={() => {
															setCookies({
																neccessaryCookies:
																	true,
																functionalCookies:
																	true,
																analyticsCookies:
																	true,
																cookiesSaved:
																	true,
																rememberDevice:
																	false,
																userEmail: "",
																isFirstVisit:
																	false,
															})
															setShowPopup(false)
														}}
														className="text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 hover:ring-2 hover:ring-amber-500 grow hover:no-underline bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl shadow-xl">
														Accept all cookies
													</Button>
													<Button
														variant="link"
														onClick={() =>
															setShowPopupDetails(
																true
															)
														}
														className="text-primary grow hover:no-underline bg-white/20 hover:bg-white/15 text-white rounded-xl shadow-xl">
														Preferences
													</Button>
												</div>
											</div>
										</div>
									)}
									{showPopupDetails && (
										<div className="text-white dark:text-zinc-800">
											<button
												onClick={() =>
													setShowPopupDetails(false)
												}
												className="text-2xl">
												<IoIosArrowBack className="ml-4" />
											</button>
											<hr className="border-zinc-700 dark:border-zinc-200" />

											<div className="min-w-48 duration-300 ease-in-out overflow-y-scroll max-h-[60vh] transition-all flex flex-col items-center">
												<h1 className="text-white dark:text-black text-2xl py-2">
													Cookie Preferences
												</h1>
												<Accordion
													type="single"
													ref={cookieAccordianRef}
													className="w-full max-w-[246px] ease-in-out-duration-300 transition-all "
													collapsible>
													<AccordionItem value="cookie-info">
														<AccordionTrigger>
															Cookie Policy Info
														</AccordionTrigger>
														<AccordionContent className="flex flex-wrap">
															<p className="pl-1">
																{
																	cookieShortPolicyDescription
																}
																<Link
																	href="/cookie-policy"
																	target="_blank"
																	className="underline ml-2 text-sky-500">
																	Learn more
																</Link>
															</p>
														</AccordionContent>
													</AccordionItem>
												</Accordion>
												<CookiesForm
													showPopup={showPopup}
													setShowPopup={setShowPopup}
													cookies={cookies}
													setCookies={setCookies}
												/>
											</div>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					)}
				</div>
			)}
		</div>
	)
}

export default CookiesPopup
