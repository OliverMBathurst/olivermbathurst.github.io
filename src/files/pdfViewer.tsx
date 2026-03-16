import { JSX } from "react"
import { PdfViewer as PdfViewerComponent } from "../components/pdfViewer"
import { FILETYPE_EXECUTABLE } from "../constants"
import { IApplicationFile } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"
import pdf from "/src/icons/pdf.png"

class PdfViewer extends AbstractLeaf implements IApplicationFile {
	constructor(parent: BranchingContext) {
		super("PDF Viewer", FILETYPE_EXECUTABLE, parent)
		this.icon = pdf
	}

	handle = (windowId: string, context: Context, setWindowTopBar: (component: JSX.Element) => void) => (
		<PdfViewerComponent windowId={windowId} context={context} setWindowTopBar={setWindowTopBar} />
	)
}

export default PdfViewer
