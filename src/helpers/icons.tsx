import { JSX } from "react"
import {
	BRANCHING_CONTEXT_TYPE_PROPERTY,
	DEFAULT_FAVICON_HREF,
	FILETYPE_EXECUTABLE,
	FILETYPE_PDF,
	FILETYPE_SHORTCUT,
	FILETYPE_TEXT,
	FILETYPE_URL_SHORTCUT,
	LEAF_EXTENSION_PROPERTY_NAME,
	SHORTCUT_DETERMINER
} from "../constants"
import {
	CustomIcon,
	DriveIcon,
	ExecutableFileIcon,
	FolderIcon,
	GenericFileIcon,
	InternetIcon,
	PdfIcon,
	TextFileIcon
} from "../icons"
import { Context } from "../types/fs"

const GENERIC_FILE_ICON_NAME = "file"
const GENERIC_FOLDER_ICON_NAME = "folder"
const GENERIC_DRIVE_ICON_NAME = "drive"

const fileNamesByExtension: Record<string, string> = {
	[FILETYPE_PDF]: "pdf",
	[FILETYPE_URL_SHORTCUT]: "internet",
	[FILETYPE_TEXT]: "textFile",
	[FILETYPE_EXECUTABLE]: "executable"
}

export const getIcon = (
	context: Context,
	props?: React.ImgHTMLAttributes<HTMLImageElement>
): JSX.Element | null => {
	if (LEAF_EXTENSION_PROPERTY_NAME in context) {
		if (context.icon) {
			return <CustomIcon src={context.icon} {...props} />
		}

		switch (context.extension) {
			case FILETYPE_PDF:
				return <PdfIcon {...props} />
			case FILETYPE_URL_SHORTCUT:
				return <InternetIcon {...props} />
			case FILETYPE_TEXT:
				return <TextFileIcon {...props} />
			case FILETYPE_EXECUTABLE:
				return <ExecutableFileIcon {...props} />
			case FILETYPE_SHORTCUT:
				if (SHORTCUT_DETERMINER in context) {
					return getIcon(context.context, props)
				}
				throw new Error("Invalid shortcut")
			default:
				return <GenericFileIcon {...props} />
		}
	} else if (BRANCHING_CONTEXT_TYPE_PROPERTY in context) {
		return <FolderIcon {...props} />
	} else {
		return <DriveIcon {...props} />
	}
}

const getIconPath = (context: Context | null): string | null => {
	const prefix = "../src/icons/"
	const suffix = ".png"

	if (!context) {
		return null
	}

	if (SHORTCUT_DETERMINER in context) {
		context = context.context
	}

	if (LEAF_EXTENSION_PROPERTY_NAME in context) {
		if (context.icon) {
			return context.icon
		}

		const name = fileNamesByExtension[context.extension]
		if (!name) {
			return `${prefix}${GENERIC_FILE_ICON_NAME}${suffix}`
		}

		return `${prefix}${name}${suffix}`
	} else if (BRANCHING_CONTEXT_TYPE_PROPERTY in context) {
		return `${prefix}${GENERIC_FOLDER_ICON_NAME}${suffix}`
	} else {
		return `${prefix}${GENERIC_DRIVE_ICON_NAME}${suffix}`
	}
}

export const changeFavicon = (context: Context | null) => {
	const iconPath = getIconPath(context) ?? DEFAULT_FAVICON_HREF

	const link = document.querySelector("link[rel~='icon']")
	if (!link) {
		const _link = document.createElement("link")
		_link.rel = "icon"
		_link.href = iconPath
		document.getElementsByTagName("head")[0].appendChild(_link)
	}

	if (link instanceof HTMLLinkElement) {
		link.href = iconPath
	}
}
