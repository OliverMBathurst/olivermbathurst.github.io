import { PdfViewer } from "../components/pdfViewer"
import { FILETYPE_PDF } from "../constants"
import { IWindowFile, IWindowRenderProps } from "../interfaces/fs"
import { AbstractLeaf, BranchingContext, Context } from "../types/fs"

class CV extends AbstractLeaf implements IWindowFile {
	constructor(parent: BranchingContext) {
		super("My CV", FILETYPE_PDF, parent)
	}

	render = (
		windowId: string,
		context: Context,
		props?: IWindowRenderProps<HTMLObjectElement>
	) => (
		<PdfViewer
			title={this.name}
			data="/documents/Oliver Bathurst CV.pdf"
			windowId={windowId}
			context={context}
			{...props}
		/>
	)
}

export default CV
