"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useLocalStorage } from "@/context/providers/localStorageContext"
import { AiFillInfoCircle } from "react-icons/ai"
import SiteParams from "@/data/_SiteParams"
import { max } from "date-fns"
import useWindowDimensions from "@/functions/useWindowDimensions"
// import { useUser } from "@clerk/nextjs"

const CookieJarView = ({ setShowCookieJar }: CookieJarProps) => {
	const { cookieJar, updateCookieJar } = useLocalStorage()
	const [popupInfoModalOpen, setPopupInfoModalOpen] = useState(false)
	const [
		cookiJarContentsFromLocalStorage,
		setCookieJarContentsFromLocalStorage,
	] = useState<string>("")
	const { width } = useWindowDimensions()
	// const { user } = useUser()
	// const user = {
	// 	organizationMemberships: {
	// 		organization: { name: "admin" },
	// 		role: "admin",
	// 	},
	// }

	// const userIsAdmin = user?.organizationMemberships.filter(
	// 	(org) => org.organization.name === "admin" || org.role === "admin"
	// )

	// const devModeTrue =
	// 	userIsAdmin && SiteParams.devMode === true ? true : false

	useEffect(() => {
		if (typeof window !== "undefined") {
			const cookieJarContents = JSON.stringify(
				window.localStorage.getItem("cookieJar"),
				null,
				2
			)
			if (!cookieJarContents) return
			setCookieJarContentsFromLocalStorage(cookieJarContents)
		}
	}, [cookieJar])

	const marginTopVal = Math.max(96, width * 0.12) + "px"

	return (
		<div id="cookie-jar-view" className="z-50">
			{popupInfoModalOpen && (
				<div className="fixed max-h-screen overflow-scroll top-0 left-0 right-0 bottom-0 backdrop-blur bg-black/80 z-[999999] flex justify-center">
					<div
						id="cookie-jar-info"
						//  set the margin top to the max of 6rem or 12vw
						style={{ marginTop: marginTopVal }}
						// style={{ marginTop: max("6rem", "12vw") }}
						className=" bg-zinc-800/80 mt-24 text-white p-8 mx-8 items-center flex flex-col h-fit">
						<h2 className="text-xl font-semibold mt-4 text-left mr-auto pb-3">
							What is CookieJar & Why is this here?
						</h2>
						<p>
							<strong>Cookie Jar</strong> is a component that
							allows developers to see and reset the state of the
							local storage cookies, and the
							useLocalStorage(Global Context) in the application.
							It is a development tool and is not visible in
							production.
						</p>
						<br />
						<br />
						<h2 className="text-xl font-semibold mt-4 text-left mr-auto pb-3">
							Adjusting Dev Mode
						</h2>
						<p>
							To hide the cookie jar, set{" "}
							<strong>SiteParams</strong>.<strong>devMode</strong>{" "}
							to <strong>false</strong> in the SiteParams object.
							<span className="text-zinc-500">
								(Located in src/context/library.tsx)
							</span>
						</p>
						<br />
						<p>
							If your website does not use cookies and you would
							like to entirely hide the cookieJar and Cookie popup
							from being used in your website, set{" "}
							<strong>SiteParams</strong>.<strong>cookies</strong>
							.<strong>enabled</strong> to <strong>false</strong>{" "}
							in the SiteParams object. You can also make changes
							to the cookie policy there.
							<span className="text-zinc-500">
								(Located in src/context/library.tsx)
							</span>
						</p>
						<button
							onClick={() => setPopupInfoModalOpen(false)}
							className="border text-amber-400 px-2 py-1 rounded-lg text-xl mt-4">
							Close
						</button>
					</div>
				</div>
			)}
			{SiteParams.devMode && (
				<div className="bg-black/80 z-50 hover:w-full max-h-[212px] w-1.5 rounded-r-xl fixed left-0 bottom-4 min-h-32 max-w-[80%] mr-4 overflow-scroll text-white px-4 py-2 transition-all ease-in-out duration-500">
					<h1 className="text-xl text-center text-white font-semibold">
						Cookie Jar
					</h1>
					<Link href="/sign-up">
					<button className="bg-zinc-800 px-6 py-1 rounded-full hover:text-white text-white/60 absolute top-2 left-32 text-xl z-50" onClick={() => setShowCookieJar(false)}>
						Sign Up
					</button>
					</Link>
					<button
						className="hover:text-white text-white/60 absolute top-2 left-4 text-xl z-50"
						// Temporarily close the cookieJar view
						onClick={() => setShowCookieJar(false)}>
						Close
					</button>
					<button onClick={() => setPopupInfoModalOpen(true)}>
						<AiFillInfoCircle className="text-white/60 text-3xl absolute top-2.5 right-20" />
					</button>
					<button
						onClick={() => {
							localStorage.setItem(
								"cookieJar",
								JSON.stringify({})
							)
							updateCookieJar({
								cookiesSaved: false,
								neccessaryCookies: true,
								functionalCookies: false,
								analyticsCookies: false,
								rememberDevice: false,
								userEmail: "",
								isFirstVisit: true
							})
						}}
						className=" absolute top-2 right-2 py-1 px-2 text-white rounded-xl shadow-xl bg-red-500/80 hover:bg-red-600">
						Reset
					</button>
					<br />
					<br />
					CookieJar Contents from in Context Provider:
					<pre className="z-50">{JSON.stringify(cookieJar, null, 2)}</pre>
					<br />
					<br />
					{/* // render the localStorage cookieJar object as a pre element */}
					CookieJar Contents from LocalStorage:
					<pre className="flex">
						{cookiJarContentsFromLocalStorage}
					</pre>
				</div>
			)}
		</div>
	)
}

type CookieJarProps = {
	setShowCookieJar: (value: boolean) => void
}

export default CookieJarView
