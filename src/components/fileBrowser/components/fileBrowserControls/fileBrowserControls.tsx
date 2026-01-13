import { useRef } from "react"
import { useSearch } from "../../../../hooks"
import { ISearchResult } from "../../../../interfaces/search"
import { BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import { SearchBar } from "../../../searchBar"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import "./fileBrowserControls.scss"

interface IFileBrowserControlsProps {
	context: BranchingContext
	onSearchCancelled: () => void
	onSearchCompleted: (results: ISearchResult) => void
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf | Shortcut) => void
}

const FileBrowserControls = (props: IFileBrowserControlsProps) => {
	const {
		context,
		onDirectoryChanged,
		onFileNavigation,
		onSearchCompleted,
		onSearchCancelled
	} = props
	const { searchForItems } = useSearch(context)

	const timeout = useRef<number | undefined>(undefined)

	const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearTimeout(timeout.current)
		timeout.current = setTimeout(() => {
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
