import { BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import { SearchBar } from "../../../searchBar"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import "./fileBrowserControls.scss"

interface IFileBrowserControlsProps {
	context: BranchingContext
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf | Shortcut) => void
}

const FileBrowserControls = (props: IFileBrowserControlsProps) => {
	const { context, onDirectoryChanged, onFileNavigation } = props

	return (
		<div className="file-browser-controls">
			<FileBrowserLocationBar
				context={context}
				onDirectoryChanged={onDirectoryChanged}
				onFileNavigation={onFileNavigation}
			/>
			<SearchBar placeholder="Search..."/>
		</div>)
}

export default FileBrowserControls