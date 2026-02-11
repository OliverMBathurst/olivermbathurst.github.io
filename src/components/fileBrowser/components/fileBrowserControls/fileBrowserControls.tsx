import { BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import { SearchBar } from "../../../searchBar"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import { FileBrowserNavigationControls } from "../fileBrowserNavigationControls"
import "./fileBrowserControls.scss"

interface IFileBrowserControlsProps {
	context: BranchingContext
	windowId: string
	searchText: string
	onBacktrack: () => void
	onForwards: () => void
	onUpOneLevel: () => void
	onSearchCancelled: () => void
	onSearchTextChanged: (text: string) => void
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf | Shortcut) => void
}

const FileBrowserControls = (props: IFileBrowserControlsProps) => {
	const {
		context,
		windowId,
		searchText,
		onDirectoryChanged,
		onFileNavigation,
		onSearchTextChanged,
		onSearchCancelled,
		onBacktrack,
		onForwards,
		onUpOneLevel
	} = props

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
				value={searchText}
				onInputChange={onSearchTextChanged}
				onCancelClicked={onSearchCancelled}
			/>
		</div>
	)
}

export default FileBrowserControls
