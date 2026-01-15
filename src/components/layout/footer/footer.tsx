import React from 'react'
import Link from 'next/link'
import Copyright from './copyright'
import { type VoidFunctionElement } from '@/types/functionTypes'
import FooterSubscribe from './footerSubscribe'
import Logo from '@/assets/branding/Logo'
import { BsLinkedin, BsStackOverflow } from 'react-icons/bs'
import { SiSentry } from 'react-icons/si'
import APP_CONFIG from '@/app-config'

const navigation = {
  solutions: [
    { name: 'Marketing', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Automation', href: '#' },
    { name: 'Commerce', href: '#' },
    { name: 'Insights', href: '#' },
  ],
  support: [
    { name: 'Submit ticket', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
  ],
  legal: [
    { name: 'Terms of service', href: '#' },
    { name: 'Privacy policy', href: '#' },
    { name: 'License', href: '#' },
  ],
  admin: [
    { name: 'PostHog', href: 'https://us.posthog.com/project/108926' },
  ],
  development: [
    { name: 'Sentry Example', internal: true, href: '/sentry-example-page' },
    {
      name: 'Sentry',
      href: APP_CONFIG.adminLinks.Sentry,
      icon: SiSentry,
    },
    { name: 'UploadThing', href: APP_CONFIG.adminLinks.UploadThing },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: '#',
      icon: BsLinkedin,
    },
    {
      name: 'X',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: 'Daily.dev',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg width="35px" height="25px" viewBox="0 0 256 144">
          <g>
            <path
              d="M219.832837,71.6995129 L191.573071,43.3805814 L205.69559,15.0714884 L251.612188,61.0842182 C257.462604,66.9468836 257.462604,76.4521422 251.612188,82.3148081 L195.097565,138.947752 C189.247148,144.810417 179.761748,144.810417 173.911332,138.947752 C168.060915,133.085086 168.060915,123.579827 173.911332,117.717162 L219.832837,71.6995129 Z"
              fill="currentColor"
            ></path>
            <path
              d="M173.921862,4.39576953 C179.772279,-1.46689601 189.260133,-1.46443637 195.11055,4.39822916 L205.706121,15.0159838 L82.0886685,138.892247 C76.238252,144.754913 66.7503974,144.752453 60.8999803,138.889788 L50.3044093,128.272033 L173.921862,4.39576953 Z M120.941551,43.3299961 L99.7504086,64.5655051 L71.4906426,36.2465737 L36.167163,71.6440084 L64.4269285,99.96294 L50.3044093,128.272033 L4.38781264,82.2593032 C-1.46260421,76.3966377 -1.46260421,66.8913792 4.38781264,61.0287132 L60.8999803,4.39822916 C66.7503974,-1.46443637 76.238252,-1.46689601 82.0886685,4.39576953 L120.941551,43.3299961 Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
    },
    {
      name: 'Stack Overflow',
      href: '#',
      icon: BsStackOverflow,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

type NavItem = {
  name: string
  href: string
  icon: VoidFunctionElement
}

const Footer = () => {
  return (
    <footer className="bg-black h-fit mt-auto">
      <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8 pt-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <Logo
            props={{
              height: 20,
              zIndex: 30,
              className: 'flex h-[120px] invert translate-y-[1rem] mb-2 mr-auto',
            }}
          />
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-white">Admin + Analytics</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.admin.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm/6 text-gray-400 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-white">Developer</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.development.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm/6 text-gray-400 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex gap-x-6 md:order-2">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="size-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <Copyright variation="inline" />
    </footer>
  )
}

export default Footer
