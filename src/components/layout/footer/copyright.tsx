import Image from 'next/image'
import React from 'react'
import NextJs from "@/assets/svg's/nextJS.svg"
import Figma from "@/assets/svg's/Figma.svg"

type Style = 'block' | 'inline' | 'none'

const Copyright = ({ variation }: { variation: Style }) => {
  return (
    <div>
      {/* Block */}
      {variation === 'block' && (
        <div className="text-center group w-fit flex md:pl-[15vw]  gap-2 md:mx-auto h-fit items-center leading-5 text-gray-400">
          <span className="text-3xl font-extralight">&copy;</span>{' '}
          <div className="items-left items-center ">
            <div className="items-left text-left items-center flex gap-1 font-semibold mt-2 w-fit">
              <a href="https://www.michaelmartell.dev" target="_blank">
                <p>
                  <span className="group-hover:text-sky-300 font-normal text-base tracking-widest group-hover:underline underline-offset-2">
                    michaelmartell.dev
                  </span>
                </p>
              </a>
            </div>
            <p className="text-[12px] text-end  -translate-y-1 text-zinc-500">
              2024 Designed and Developed
            </p>
            <p className="text-[12px] text-end  -translate-y-1 text-zinc-500">Build with</p>
            <Image src={NextJs} className="invert" alt="Next.js Logo" width={20} height={20} />
          </div>
        </div>
      )}

      {/* Inline */}
      {variation === 'inline' && (
        <div className=" hidden text-center absolute  left-0 bottom-0 align-end w-screen pb-1 justify-center  md:flex mx-auto gap-1 h-fit items-center text-gray-400">
          <div className="w-fit flex mx-auto items-center">
            <span className="text-[1.3rem] font-extralight text-zinc-600">&copy;</span>{' '}
            <a href="https://www.michaelmartell.dev" className="w-fit group" target="_blank">
              <p>
                <span className="tracking-tighter font-semibold text-zinc-600 mr-1">2024</span>
                <span className="group-hover:text-sky-200 text-zinc-600 font-normal text-base tracking-widest group-hover:underline underline-offset-2">
                  michaelmartell.dev
                </span>
              </p>
            </a>
            <p className="text-[12px] pl-1 whitespace-nowrap text-end mt-1 tracking-tighter text-zinc-700">
              Designed in
            </p>
            <Image
              src={Figma}
              className="invert ml-2 mt-1"
              alt="Figma Logo"
              width={12}
              height={12}
            />
            <p className="text-[12px] pl-1 whitespace-nowrap text-end mt-1 tracking-tighter text-zinc-700">
              Developed with
            </p>
            <p className="text-[12px] text-end  -translate-y-1 text-zinc-500"></p>
            <Image
              src={NextJs}
              className="invert ml-2 mt-1"
              alt="Next.js Logo"
              width={40}
              height={40}
            />
          </div>
        </div>
      )}

      {/* Inline - Small screens (Copy of block) */}
      {/* Block */}
      {variation === 'inline' && (
        <div className=" md:hidden text-center group w-fit flex md:pl-[15vw]  gap-2 md:mx-auto h-fit items-center leading-5 text-gray-400">
          <span className="text-3xl font-extralight">&copy;</span>
          <div className="items-left items-center ">
            <div className="items-left text-left items-center flex gap-1 font-semibold mt-2 w-fit">
              <a href="https://www.michaelmartell.dev" target="_blank">
                <p>
                  <span className="group-hover:text-sky-300 font-normal text-base tracking-widest group-hover:underline underline-offset-2">
                    michaelmartell.dev
                  </span>
                </p>
              </a>
            </div>
            <p className="text-[12px] text-end  -translate-y-1 text-zinc-500">
              2024 Designed and Developed
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Copyright
