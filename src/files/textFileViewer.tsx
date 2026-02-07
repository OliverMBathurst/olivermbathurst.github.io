import { MonacoEditor } from "../components/monaco"
import { FILETYPE_EXECUTABLE } from "../constants"
import { IApplicationFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

const icon = "/src/icons/textFile.png"

class TextFileViewer extends AbstractLeaf implements IApplicationFile {
	constructor(parent: BranchingContext) {
		super("Monaco Editor", FILETYPE_EXECUTABLE, parent)
		this.icon = icon
	}

	handle = (windowId: string, context: Context) => (
		<MonacoEditor windowId={windowId} context={context} />
	)
}

export default TextFileViewer
