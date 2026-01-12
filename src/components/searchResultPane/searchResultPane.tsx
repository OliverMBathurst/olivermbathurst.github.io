import { NO_SELECT_CLASS } from "../../constants"
import { ILikenessResult } from "../../interfaces/search"
import { Context } from "../../types/fs"
import { SearchResultPaneRow } from "./components"
import "./searchResultPane.scss"

interface ISearchResultPaneProps {
	items: ILikenessResult[]
	selectedContextKeys: string[]
	onRowClicked: (
		context: Context,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onRowDoubleClicked: (
		context: Context,
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	refCallback: (context: Context, element: HTMLDivElement | null) => void
}

const SearchResultPane = (props: ISearchResultPaneProps) => {
	const {
		items,
		selectedContextKeys,
		onRowClicked,
		onRowDoubleClicked,
		refCallback
	} = props

	if (items.length === 0) {
		return (
			<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
				No results found
			</span>
		)
	}

	return (
		<div className="search-result-pane">
			{items.map((i) => {
				const contextKey = i.context.toContextUniqueKey()
				return (
					<SearchResultPaneRow
						key={contextKey}
						refCallback={refCallback}
						item={i}
						selected={selectedContextKeys.indexOf(contextKey) !== -1}
						onRowClicked={(e) => onRowClicked(i.context, e)}
						onRowDoubleClicked={(e) => onRowDoubleClicked(i.context, e)}
					/>
				)
			})}
		</div>
	)
}

export default SearchResultPane
