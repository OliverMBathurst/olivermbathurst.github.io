import {
    PdfViewer as PdfViewerComponent
} from "../components/pdfViewer"
import { FILETYPE_EXECUTABLE } from "../constants"
import { IApplicationFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

class PdfViewer extends AbstractLeaf implements IApplicationFile {
	constructor(parent: BranchingContext) {
		super("PDF Viewer", FILETYPE_EXECUTABLE, parent)
	}

	handle = (windowId: string, context: Context) => (
		<PdfViewerComponent windowId={windowId} context={context} />
	)
}

export default PdfViewer
