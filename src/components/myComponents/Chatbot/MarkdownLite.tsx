import React from "react"
import Link from "next/link"

const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g

const MarkdownLite = ({ text }: { text: string }) => {
	const parts = []
	let lastIndex = 0
	let match

	while ((match = LINK_REGEX.exec(text)) !== null) {
		const [fullMatch, linkText, linkUrl] = match
		const matchStart = match.index

		if (lastIndex < matchStart) {
			parts.push(text.slice(lastIndex, matchStart))
		}

		parts.push(
			<Link
				key={fullMatch}
				href={linkUrl}
				target="_blank"
				className="text-teal-400 underline hover:text-teal-300 transition-colors"
			>
				{linkText}
			</Link>
		)
		lastIndex = LINK_REGEX.lastIndex
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex))
	}

	return (
		<span className="whitespace-pre-wrap break-words">
			{parts.map((part, i) => (
				<React.Fragment key={i}>{part}</React.Fragment>
			))}
		</span>
	)
}

export default MarkdownLite
