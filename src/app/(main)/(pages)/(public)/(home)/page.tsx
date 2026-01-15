import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import LoginButton from "@/components/LoginButton";
import { FC } from "react";
import "@/styles/globals.css";
import Image from "next/image";
import MainLogoInvert from "@/assets/branding/MainLogo_Invert.svg"
import APP_CONFIG from "@/app-config";
import NewsBanner from "@/components/myComponents/Navbar/newsBanner";
import TextCycle from "@/components/hover.dev/textCycle"
import Socials from "@/components/myComponents/Footer/socials";
import HomeContent from "./content"
import { SignInSection } from "@/components/auth/SignInSection";
import { auth } from '@clerk/nextjs/server'

const Home: FC = async () => {
  const { userId } = await auth()
  const { isUnderDevelopment } = APP_CONFIG

  return (
    <div className="">
     {isUnderDevelopment &&  (
      <NewsBanner
					props={{
						newsBanner: {
							newsBannerText:
								"Some really cool stuff is in the works. Stay tuned! In the meantime, check out my 2022 porfolio located at:",
							newsBannerLink: "https://michael-martell.com",
							newsBannerButtonText: "michael-martell.com.",
							newsBannerOpen: true,
							hiddenOnHome: false,
						},
					}}
				/>
        )}
      <div className="h-screen flex flex-col px-4 pt-2 pb-8 bg-neutral-950">
        <header className="w-full gap-6 mb-8 flex justify-end">
          <SignInSection />
        </header>
        <main className="flex flex-col h-full items-center justify-center pb-16 gap-6">
          	<Image
						alt="Main Logo"
						className="animate-pulse w-48 mb-10"
						src={MainLogoInvert}
						width={200}
						height={200}
					/>
					<div className="grid gap-6 text-center">
						<h2 className="text-4xl md:text-5xl font-thin text-teal-300">
							{Array.from("MichaelMartell.com").map(
								(char, idx) => (
									<span
										key={idx}
										className="inline-block hover:text-white hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
										{char}
									</span>
								)
							)}
						</h2>
						<TextCycle
							className="text-3xl text-zinc-800 uppercase"
							phrases={[
								"React Developer",
								"Swift Developer",
								"Designer and Artist",
							]}
						/>
					</div>
          <HomeContent />
          <div className="flex flex-wrap justify-center gap-4">
							<Socials />
						</div>
        </main>
      </div>
    </div>
  );
}

export default Home

