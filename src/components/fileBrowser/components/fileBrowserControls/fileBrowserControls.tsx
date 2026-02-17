import { BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import { SearchBar } from "../../../searchBar"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import { FileBrowserNavigationControls } from "../fileBrowserNavigationControls"
import "./fileBrowserControls.scss"

interface IFileBrowserControlsProps {
	context: BranchingContext
	windowId: string
	searchText: string
	backwardsPossible: boolean
	forwardsPossible: boolean
	onBackwards: () => void
	onForwards: () => void
	onSearchCancelled: () => void
	onSearchTextChanged: (text: string) => void
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf | Shortcut) => void
}

const FileBrowserControls = (props: IFileBrowserControlsProps) => {
	const {
		context,
		searchText,
		backwardsPossible,
		forwardsPossible,
		onDirectoryChanged,
		onFileNavigation,
		onSearchTextChanged,
		onSearchCancelled,
		onBackwards,
		onForwards
	} = props

	return (
		<div className="file-browser-controls">
			<FileBrowserNavigationControls
				onBackwards={onBackwards}
				onForwards={onForwards}
				backwardsPossible={backwardsPossible}
				forwardsPossible={forwardsPossible}
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
