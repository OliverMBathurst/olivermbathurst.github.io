import { Context } from "../../../../types/fs"
import { SearchBar } from "../../../searchBar"
import { FileBrowserLocationBar } from "../fileBrowserLocationBar"
import "./fileBrowserControls.scss"

interface IFileBrowserControlsProps {
	context: Context
}

const FileBrowserControls = (props: IFileBrowserControlsProps) => {
	const { context } = props

	return (
		<div className="file-browser-controls">
			<FileBrowserLocationBar context={context} />
			<SearchBar placeholder="Search..."/>
		</div>)
}

export default FileBrowserControls