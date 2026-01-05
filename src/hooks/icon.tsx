import { JSX, useMemo } from "react"
import {
	BRANCHING_CONTEXT_TYPE_PROPERTY,
	FILETYPE_EXECUTABLE,
	FILETYPE_PDF,
	FILETYPE_TEXT,
	FILETYPE_URL_SHORTCUT,
	LEAF_EXTENSION_PROPERTY_NAME
} from "../constants"
import {
	DriveIcon,
	ExecutableFileIcon,
	FolderIcon,
	GenericFileIcon,
	InternetIcon,
	PdfIcon,
	TextFileIcon
} from "../icons"
import { Context } from "../types/fs"

const useIcon: (context: Context, noSelect?: boolean) => JSX.Element = (
	context: Context,
	noSelect: boolean = true
) => {
	const Icon = useMemo(() => {
		let props = {
			className: noSelect ? "no-select" : ""
		}

		if (LEAF_EXTENSION_PROPERTY_NAME in context) {
			switch (context.extension) {
				case FILETYPE_PDF:
					return <PdfIcon {...props} />
				case FILETYPE_URL_SHORTCUT:
					return <InternetIcon {...props} />
				case FILETYPE_TEXT:
					return <TextFileIcon {...props} />
				case FILETYPE_EXECUTABLE:
					return <ExecutableFileIcon {...props} />
				default:
					return <GenericFileIcon />
			}
		} else if (BRANCHING_CONTEXT_TYPE_PROPERTY in context) {
			return <FolderIcon />
		} else {
			return <DriveIcon />
		}
	}, [context, noSelect])

	return <>{Icon}</>
}

export default useIcon
