import { NO_SELECT_CLASS } from "../../../constants"
import { useDisplayName, useIcon } from "../../../hooks"
import { ILikenessResult } from "../../../interfaces/search"
import { Context } from "../../../types/fs"
import "./searchResultPaneRow.scss"

interface ISearchResultPaneRowProps {
	item: ILikenessResult
	selected: boolean
	refCallback: (context: Context, element: HTMLDivElement | null) => void
	onRowDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onRowClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const SearchResultPaneRow = (props: ISearchResultPaneRowProps) => {
	const { item, selected, refCallback, onRowDoubleClicked, onRowClicked } = props

	const Icon = useIcon(item.context)
	const DisplayName = useDisplayName(item.context)

    return (
		<div
			className={`search-result-pane__row${selected ? "--selected" : ""}`}
			ref={r => refCallback(item.context, r)}
			onDoubleClick={onRowDoubleClicked}
			onClick={onRowClicked}
		>
			<div className={`search-result-pane__row__icon ${NO_SELECT_CLASS}`}>{Icon}</div>
			<div className={`search-result-pane__row__name ${NO_SELECT_CLASS}`}>
				{DisplayName}
			</div>
		</div>
    )
}

export default SearchResultPaneRow