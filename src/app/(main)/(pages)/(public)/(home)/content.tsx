"use client"

import { FC, useState, Suspense, useRef } from "react"
import { Button } from "@/components/shadcn/button"
import { ArrowRight, Mail } from "lucide-react"
import { BsSpotify } from "react-icons/bs"
import Loading from "@/app/loading"
import Modal from "@/components/layout/Modal"

const HomeContent: FC = () => {
		const [isOpen, setIsOpen] = useState<boolean>(false)
		const [isMinimized, setIsMinimized] = useState<boolean>(false)
		const launchpadButtonRef = useRef<HTMLButtonElement | null>(null)
		const onClose = () => setIsOpen(false)

	const handlePlayerClick = () => {
		const player = document.getElementById("spotify-player")
		if (player) {
			player.click()
		}
	}

	return (
	<Suspense fallback={<Loading />}>
		   	<div className="flex flex-col sm:flex-row gap-4 items-center">
								<Button
									className="group text-lg text-white bg-zinc-900 hover:bg-zinc-800"
									variant="secondary"
									onClick={() => {
										setIsOpen(!isOpen)
									}}
									>
									<Mail
										className="-ms-1 me-2 opacity-60"
										size={16}
									/>
									Contact Me
									<ArrowRight
										className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
										size={9}
									/>
								</Button>
							<Button
								className="group text-lg bg-[#1DB954] hover:bg-[#1ed760] text-black"
								onClick={handlePlayerClick}>
								<BsSpotify className="-ms-1 me-2" size={20} />
								My Recent Favorites
							</Button>
						</div>
				<Modal
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					onClose={onClose}
					isMinimized={isMinimized}
					setIsMinimized={setIsMinimized}
					launchpadButtonRef={launchpadButtonRef}
				/>
		</Suspense>
	)
}
	
export default HomeContent
