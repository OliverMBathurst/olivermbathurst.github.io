import { useEffect, useRef } from "react"
import { useClickOutside, useSearchPane } from "../../../../hooks"
import "./search.scss"

interface ISearchProps {
	text: string
	positionRef: React.RefObject<HTMLDivElement | null>
	onClickedOutside: () => void
}

const Search = (props: ISearchProps) => {
	const { text, positionRef, onClickedOutside } = props

	const searchRef = useRef<HTMLDivElement | null>(null)
	const { SearchPane } = useSearchPane(text)

	useClickOutside(searchRef, onClickedOutside)

	useEffect(() => {
		if (!positionRef.current || !searchRef.current) {
			return
		}

		const positionRect = positionRef.current.getBoundingClientRect()
		searchRef.current.style.left = `${positionRect.left}px`
	}, [])

    return (
		<div className="search" ref={searchRef}>
			{SearchPane}
        </div>)
}

export default Search