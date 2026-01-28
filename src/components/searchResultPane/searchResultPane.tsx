import { NO_SELECT_CLASS } from "../../constants"
import { ISearchResult } from "../../interfaces/search"
import { Context } from "../../types/fs"
import { SearchResultPaneRow } from "./components"
import "./searchResultPane.scss"

interface ISearchResultPaneProps {
	searchResult: ISearchResult | null
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
		searchResult,
		selectedContextKeys,
		onRowClicked,
		onRowDoubleClicked,
		refCallback
	} = props

	return (
		<div className="search-result-pane">
			{(!searchResult || searchResult.items.length === 0) && (
				<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
					No results found
				</span>
			)}
			{searchResult && searchResult.items.length > 0 && searchResult.items.map((i) => {
				const contextKey = i.context.toContextUniqueKey()
				return (
					<SearchResultPaneRow
						key={contextKey}
						refCallback={refCallback}
						item={i}
						term={searchResult.term}
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
