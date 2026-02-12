import { useEffect, useRef, useState } from "react"
import { useClickOutside, useSearchResultPane } from "../../../../hooks"
import { CLASSNAMES } from "../../../../constants";
import "./search.scss"
import { FileSystemFilterType } from "../../../../enums";
import { Button } from "../../../button";

const { SEARCH_CLASSES } = CLASSNAMES

interface ISearchProps {
	text: string
	positionRef: React.RefObject<HTMLDivElement | null>
	onClickedOutside: () => void
}

const clickOutsideExclusions = [
	...Object.values(SEARCH_CLASSES)
]

const Search = (props: ISearchProps) => {
	const { text, positionRef, onClickedOutside } = props
	const [filter, setFilter] = useState<FileSystemFilterType>(FileSystemFilterType.All)

	const searchRef = useRef<HTMLDivElement | null>(null)
	const { SearchPane } = useSearchResultPane(
		text,
		{
			showRecents: true,
			categorise: true,
			filter
		}
	)

	useClickOutside(searchRef, (e) => {
		let validClick: boolean = true
		if (e.target instanceof HTMLElement) {
			const elem = e.target as HTMLElement
			if (clickOutsideExclusions.some((x) => elem.classList.contains(x))) {
				validClick = false
			}
		}

		if (validClick) {
			onClickedOutside()
		}
	})

	useEffect(() => {
		if (!positionRef.current || !searchRef.current) {
			return
		}

		const positionRect = positionRef.current.getBoundingClientRect()
		searchRef.current.style.left = `${positionRect.left}px`
	}, [])

    return (
		<div className="search" ref={searchRef}>
			<div className="search__filter-controls">
				{Object.values(FileSystemFilterType).map(v => {
					return (
						<Button 
							className={`search__filter-controls__button${filter === v ? "--selected" : ""}`}
							onClick={() => setFilter(v)}
						>
							{v}
						</Button>
					)
				})}
			</div>
			{SearchPane}
        </div>)
}

export default Search