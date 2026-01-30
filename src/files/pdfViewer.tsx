import {
	IPdfViewerProps,
	PdfViewer as PdfViewerComponent
} from "../components/pdfViewer"
import { FILETYPE_EXECUTABLE } from "../constants"
import { IWindowFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

class PdfViewer extends AbstractLeaf implements IWindowFile {
	constructor(parent: BranchingContext) {
		super("PDF Viewer", FILETYPE_EXECUTABLE, parent)
	}

	render = (windowId: string, context: Context, props?: IPdfViewerProps) => (
		<PdfViewerComponent windowId={windowId} context={context} {...props} />
	)
}

export default PdfViewer
