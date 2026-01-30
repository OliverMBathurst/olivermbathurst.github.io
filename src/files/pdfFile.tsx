import { PdfViewer } from "../components/pdfViewer"
import { IUploadedWindowFile, IWindowRenderProps } from "../interfaces/fs"
import { AbstractUploadedWindowFile, Context } from "../types/fs"

class PdfFile
	extends AbstractUploadedWindowFile
	implements IUploadedWindowFile
{
	render = (
		windowId: string,
		context: Context,
		props?: IWindowRenderProps<HTMLObjectElement>
	) => <PdfViewer windowId={windowId} context={context} {...props} />
}

export default PdfFile
