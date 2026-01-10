import { Context } from "../../../../types/fs"
import "./fileBrowserLocationBar.scss"

interface IFileBrowserLocationBarProps {
	context: Context
}

const FileBrowserLocationBar = (props: IFileBrowserLocationBarProps) => {
	const { context } = props

	return (
		<span className="file-browser-location-bar">

		</span>)
}

export default FileBrowserLocationBar