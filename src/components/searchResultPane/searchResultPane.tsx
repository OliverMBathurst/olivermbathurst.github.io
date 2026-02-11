import { CLASSNAMES } from "../../constants"
import { ILikenessResult, ISearchResult } from "../../interfaces/search"
import { SearchResultPaneRow } from "./components"
import "./searchResultPane.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface ISearchResultPaneProps {
	searchResult: ISearchResult | null
	selectedContextKeys: string[]
	onRowClicked: (
		item: ILikenessResult,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onRowDoubleClicked: (
		item: ILikenessResult,
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
	refCallback: (path: string, element: HTMLDivElement | null) => void
}

const SearchResultPane = (props: ISearchResultPaneProps) => {
	const {
		searchResult,
		selectedContextKeys,
		onRowClicked,
		onRowDoubleClicked,
		onKeyDown,
		refCallback
	} = props

	return (
		<div className="search-result-pane" onKeyDown={onKeyDown} tabIndex={0}>
			{(!searchResult || searchResult.items.length === 0) && (
				<span className={`search-result-pane__no-items ${NO_SELECT_CLASS}`}>
					No results found
				</span>
			)}
			{searchResult &&
				searchResult.items.length > 0 &&
				searchResult.items.map((i) => {
					const { path } = i
					return (
						<SearchResultPaneRow
							key={path}
							refCallback={refCallback}
							item={i}
							term={searchResult.term}
							selected={selectedContextKeys.indexOf(path) !== -1}
							onRowClicked={(e) => onRowClicked(i, e)}
							onRowDoubleClicked={(e) => onRowDoubleClicked(i, e)}
						/>
					)
				})}
		</div>
	)
}

export default SearchResultPane
