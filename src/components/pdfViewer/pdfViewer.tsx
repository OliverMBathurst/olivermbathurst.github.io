import { useContext, useRef } from "react"
import { FILETYPE_DATA_PROPERTY, FILETYPE_PDF } from "../../constants"
import { WindowsContext } from "../../contexts"
import { PdfFile } from "../../files"
import { IWindowRenderProps } from "../../interfaces/fs"
import { Context } from "../../types/fs"
import { FileSelector } from "../fileSelector"
import "./pdfViewer.scss"

export interface IPdfViewerProps extends IWindowRenderProps<HTMLObjectElement>, React.ObjectHTMLAttributes<HTMLObjectElement> { }

interface IObjectProps extends React.ObjectHTMLAttributes<HTMLObjectElement> {
	windowId?: string
	context?: Context
}

const PdfViewer = (props: IPdfViewerProps) => {
	const { windowId, context, data } = props
	const { setWindowContext } = useContext(WindowsContext)
	const resolvedData = data
		? data
		: FILETYPE_DATA_PROPERTY in context
			? (context.data ?? undefined)
			: undefined
	const inputRef = useRef<HTMLInputElement | null>(null)

	const onInputChange = (_: React.ChangeEvent<HTMLInputElement>) => {
		if (inputRef.current) {
			const files = inputRef.current.files
			if (files) {
				const file = files[0]
				const fileName = file.name.split(".")

				const uploadedFile = new PdfFile(
					fileName[0],
					fileName[0] + "." + fileName[1],
					inputRef.current.value,
					Date.now(),
					FILETYPE_PDF
				)

				const reader = new FileReader()
				reader.readAsDataURL(file)
				reader.onload = () => {
					const result = reader.result
					if (!(result instanceof ArrayBuffer)) {
						uploadedFile.data = result
						setWindowContext(windowId, uploadedFile)
					}
				}
			}
		}
	}

	const objectProps: IObjectProps = { ...props }
	delete objectProps.windowId
	delete objectProps.context

	return (
		<div className="pdf-viewer">
			<div className="pdf-viewer-controls">
				<FileSelector accept={FILETYPE_PDF} onChange={onInputChange} forwardRef={inputRef} />
			</div>
			{resolvedData && (
				<object
					className="pdf-viewer-content"
					data={resolvedData}
					{...objectProps}
				>
					Sorry, your browser doesn't support PDF preview.
				</object>
			)}
		</div>
    )
}

export default PdfViewer