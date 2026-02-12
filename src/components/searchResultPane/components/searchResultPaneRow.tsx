import { JSX, useEffect, useState } from "react"
import { CLASSNAMES } from "../../../constants"
import { useDisplayName, useIcon } from "../../../hooks"
import { IFileSystemResultTuple } from "../../../interfaces/search"
import "./searchResultPaneRow.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface ISearchResultPaneRowProps {
	item: IFileSystemResultTuple
	term?: string
	selected: boolean
	refCallback: (path: string, element: HTMLDivElement | null) => void
	onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onRowClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const SearchResultPaneRow = (props: ISearchResultPaneRowProps) => {
	const {
		item: { context, path },
		term,
		selected,
		refCallback,
		onRowDoubleClicked,
		onRowClicked
	} = props

	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)

	const [highlightedDisplayName, setHighlightedDisplayName] =
		useState<JSX.Element>(<span>{DisplayName}</span>)

	useEffect(() => {
		if (!term) {
			setHighlightedDisplayName(<span>{DisplayName}</span>)
			return 
		}

		const idx = DisplayName.toLowerCase().indexOf(term.toLowerCase())

		if (idx === -1) {
			setHighlightedDisplayName(<span>{DisplayName}</span>)
			return
		}

		const highlightSubstring = DisplayName.substring(idx, idx + term.length)
		const beforeSubstring = DisplayName.substring(0, idx)
		const afterSubstring = DisplayName.substring(
			idx + term.length,
			DisplayName.length
		)

		setHighlightedDisplayName(
			<span>
				{beforeSubstring}
				<b>{highlightSubstring}</b>
				{afterSubstring}
			</span>
		)
	}, [DisplayName, term])

	return (
		<div
			className={`search-result-pane__row${selected ? "--selected" : ""}`}
			ref={(r) => refCallback(path, r)}
			onDoubleClick={onRowDoubleClicked}
			onClick={onRowClicked}
		>
			<div className={`search-result-pane__row__icon ${NO_SELECT_CLASS}`}>
				{Icon}
			</div>
			<div className="search-result-pane__row__name">
				<div
					className={`search-result-pane__row__name__name ${NO_SELECT_CLASS}`}
				>
					{highlightedDisplayName}
				</div>
				<div
					className={`search-result-pane__row__name__location ${NO_SELECT_CLASS}`}
				>
					{path}
				</div>
			</div>
		</div>
	)
}

export default SearchResultPaneRow
