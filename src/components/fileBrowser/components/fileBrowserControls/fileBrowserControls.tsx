import { useRef } from "react"
import { useSearch } from "../../../../hooks"
import { ISearchResult } from "../../../../interfaces/search"
import { BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import { SearchBar } from "../../../searchBar"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import { FileBrowserNavigationControls } from "../fileBrowserNavigationControls"
import "./fileBrowserControls.scss"

interface IFileBrowserControlsProps {
	context: BranchingContext
	windowId: string
	onBacktrack: () => void
	onForwards: () => void
	onUpOneLevel: () => void
	onSearchCancelled: () => void
	onSearchCompleted: (results: ISearchResult) => void
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf | Shortcut) => void
}

const FileBrowserControls = (props: IFileBrowserControlsProps) => {
	const {
		context,
		windowId,
		onDirectoryChanged,
		onFileNavigation,
		onSearchCompleted,
		onSearchCancelled,
		onBacktrack,
		onForwards,
		onUpOneLevel
	} = props
	const { searchForItems } = useSearch(context)

	const searchTimeout = useRef<number | undefined>(undefined)

	const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearTimeout(searchTimeout.current)
		searchTimeout.current = setTimeout(() => {
			const val = e.target.value
			if (val === "") {
				onSearchCancelled()
			} else {
				const items = searchForItems(val)
				onSearchCompleted({
					term: val,
					items
				})
			}
		}, 300)
	}

	return (
		<div className="file-browser-controls">
			<FileBrowserNavigationControls
				context={context}
				windowId={windowId}
				onBacktrack={onBacktrack}
				onForwards={onForwards}
				onUpOneLevel={onUpOneLevel}
			/>
			<FileBrowserLocationBar
				context={context}
				onDirectoryChanged={onDirectoryChanged}
				onFileNavigation={onFileNavigation}
			/>
			<SearchBar
				placeholder="Search..."
				onChange={onSearchInputChanged}
				onCancelClicked={onSearchCancelled}
			/>
		</div>
	)
}

export default FileBrowserControls
