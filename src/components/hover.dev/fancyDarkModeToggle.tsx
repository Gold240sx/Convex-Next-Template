"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsFillCloudyFill, BsStarFill } from "react-icons/bs";

const ToggleWrapper = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[35px] items-center justify-center px-4 transition-colors">
        <div className="h-[1.5rem] !w-[4.2rem]" />
      </div>
    );
  }

  return (
    <div className="flex h-[35px] w-fit items-center justify-center pr-4 transition-colors">
      <DarkModeToggle theme={theme} setTheme={setTheme} resolvedTheme={resolvedTheme} />
    </div>
  );
};

const DarkModeToggle = ({
  theme,
  setTheme,
  resolvedTheme,
}: {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
}) => {
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex w-[4.2rem] overflow-hidden rounded-full bg-gradient-to-b p-1.5 shadow-lg saturate-[75%] transition-all !duration-500 ease-in-out hover:shadow-lg hover:saturate-100 ${
        !isDark
          ? "justify-end from-blue-500 to-sky-300 shadow-sky-500/30"
          : "justify-start from-indigo-600 to-indigo-400 shadow-blue-500/30"
      } ${
        !isDark
          ? "hover:shadow-gray-500/20"
          : "shadow-2xl hover:shadow-white/20"
      }`}
    >
      <Thumb mode={isDark ? "dark" : "light"} />
      {!isDark && <Clouds />}
      {isDark && <Stars />}
    </button>
  );
};

const Thumb = ({ mode }: { mode: "light" | "dark" }) => {
  return (
    <motion.div
      layout
      transition={{
        duration: 0.75,
        type: "spring",
      }}
      className="relative h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full shadow-lg"
    >
      <div
        className={`absolute inset-0 ${
          mode === "dark"
            ? "bg-slate-100"
            : "animate-pulse rounded-full bg-gradient-to-tr from-amber-300 to-yellow-500"
        }`}
      />
      {mode === "light" && <SunCenter />}
      {mode === "dark" && <MoonSpots />}
    </motion.div>
  );
};

const SunCenter = () => (
  <div className="absolute inset-1.5 rounded-full bg-amber-300" />
);

const MoonSpots = () => (
  <>
    <motion.div
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="absolute bottom-1 right-2.5 h-3 w-3 rounded-full bg-slate-300"
    />
    <motion.div
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="absolute bottom-4 left-1 h-3 w-3 rounded-full bg-slate-300"
    />
    <motion.div
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      className="absolute right-2 top-2 h-2 w-2 rounded-full bg-slate-300"
    />
  </>
);

const Stars = () => {
  return (
    <>
      <motion.span
        animate={{
          scale: [0.75, 1, 0.75],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeIn",
        }}
        className="absolute right-10 top-2 text-xs text-slate-300"
      >
        <BsStarFill />
      </motion.span>
      <motion.span
        animate={{
          scale: [1, 0.75, 1],
          opacity: [0.5, 0.25, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeIn",
        }}
        style={{ rotate: "-45deg" }}
        className="absolute right-4 top-3 text-lg text-slate-300"
      >
        <BsStarFill />
      </motion.span>
      <motion.span
        animate={{
          scale: [1, 0.5, 1],
          opacity: [1, 0.5, 1],
        }}
        style={{ rotate: "45deg" }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeIn",
        }}
        className="absolute right-8 top-8 text-slate-300"
      >
        <BsStarFill />
      </motion.span>
    </>
  );
};

const Clouds = () => {
  return (
    <div className="overflow-hidden">
      <motion.span
        animate={{ x: [-20, -15, -10, -5, 0], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: 0.25,
        }}
        className="absolute left-10 top-1 overflow-hidden text-xs text-white"
      >
        <BsFillCloudyFill />
      </motion.span>
      <motion.span
        animate={{ x: [-10, 0, 10, 20, 30], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          delay: 0.5,
        }}
        className="absolute left-4 top-4 overflow-hidden text-lg text-white"
      >
        <BsFillCloudyFill />
      </motion.span>
      <motion.span
        animate={{ x: [-7, 0, 7, 14, 21], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 12.5,
          repeat: Infinity,
        }}
        className="absolute left-9 top-8 overflow-hidden text-white"
      >
        <BsFillCloudyFill />
      </motion.span>
      <motion.span
        animate={{ x: [-15, 0, 15, 30, 45], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          delay: 0.75,
        }}
        className="absolute left-14 top-4 overflow-hidden text-xs text-white"
      >
        <BsFillCloudyFill />
      </motion.span>
    </div>
  );
};

export default ToggleWrapper;
