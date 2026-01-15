'use client'
import React from 'react'
import { AiFillCheckSquare } from 'react-icons/ai'

const FooterSubscribe = () => {
  const subscribe = () => {
    alert('Subscribed!')
  }

  return (
    <div className="m:h-12">
      <form onSubmit={() => subscribe()}>
        <div
          id="footer-subscribe"
          className="md:items-end items-center justify-center md:justify-end flex-col flex ease-in-out duration-300 transition-all"
        >
          <p className="text-white text-xl">Subscribe to our Newsletter</p>
          <div className="flex group md:focus-within:ring-amber-400 md:focus-within:ring-1">
            <input
              type="email"
              placeholder="Your Email"
              className="min-w-24 w-full md:w-[20vw] border-0 group-hover:mr-2 md:group-hover:mr-0 max-w-48 h-8 bg-zinc-800 text-white focus:ring-amber-300"
            />
            <button className=" text-black max-w-26 w-fit h-8 " type="submit">
              <p className="md:flex hidden px-4 text-center text-white py-[3px] bg-zinc-500 group-hover:bg-amber-400">
                Subscribe
              </p>
              <p className="flex md:hidden">
                <AiFillCheckSquare
                  className={`w-10 h-10 -translate-y-1 -translate-x-1 group-hover:text-amber-400 text-zinc-800 group-hover:bg-white group-hover:w-8 group-hover:h-8 group-hover:translate-y-0`}
                />
              </p>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FooterSubscribe
