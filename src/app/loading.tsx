import Image from "next/image";
import MainLogoInvert from "@/assets/branding/MainLogo_Invert.svg"

const Loading = () => {
	return (
	<div className="">
      <div className="h-screen flex flex-col px-4 pt-2 pb-8 bg-neutral-950">
        <main className="flex flex-col h-full items-center justify-center pb-16">
          <Image
				alt="Main Logo"
				className="animate-pulse w-48 mb-10"
				src={MainLogoInvert}
				width={100}
				height={100}
				preload
				loading="eager"
			/>
			<div className="flex items-center gap-2 text-2xl">
				<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
				<div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
				<div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
				<p className="ml-2 text-slate-600 dark:text-slate-400">Loading...</p>
			</div>
        </main>
      </div>
    </div>
	)
}

export default Loading;