import { useCallback, useEffect, useRef, useState } from "react"
import { useClickOutside, useSearchResultPane } from "../../../../hooks"
import { CLASSNAMES } from "../../../../constants";
import "./search.scss"
import { FileSystemFilterType } from "../../../../enums";
import { Button } from "../../../button";
import { IFileSystemResultTuple } from "../../../../interfaces/search";
import { InfoCard } from "../../../infoCard";

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
	const [selectedItems, setSelectedItems] = useState<IFileSystemResultTuple[]>([])

	const searchRef = useRef<HTMLDivElement | null>(null)

	const onSelectionChanged = useCallback((selectedContextKeys: string[], selections?: IFileSystemResultTuple[]) => {
		if (!selections || selectedContextKeys.length === 0) {
			setSelectedItems([])
			return
		}

		const newSelection = selections
			.filter(x => selectedContextKeys.indexOf(x.path) !== -1)

		setSelectedItems(newSelection)
	}, [setSelectedItems])

	const { SearchResultPane } = useSearchResultPane(
		text,
		{
			showRecents: true,
			categorise: true,
			filter
		},
		onSelectionChanged
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
			<div className="search__body">
				<div className="search__body__pane">
					<div className="search__body__pane__filter-controls">
						{Object.values(FileSystemFilterType).map(v => {
							return (
								<Button
									key={v}
									className={`search__body__pane__filter-controls__button${filter === v ? "--selected" : ""}`}
									onClick={() => setFilter(v)}
								>
									{v}
								</Button>
							)
						})}
					</div>
					{SearchResultPane}
				</div>
				<div className="search__body__info-cards">
					{selectedItems.length > 0 && (
						selectedItems.map(si => {
							return (
								<InfoCard
									key={si.path}
									item={si}
								/>
							)
						})
					)}
				</div>
			</div>
        </div>)
}

export default Search