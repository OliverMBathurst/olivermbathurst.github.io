import { JSX } from "react"
import {
    BRANCHING_CONTEXT_TYPE_PROPERTY,
    DEFAULT_FAVICON_HREF,
    FILETYPE_CUSTOM_ICON,
    FILETYPE_EXECUTABLE,
    FILETYPE_GAME,
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
    GameIcon,
    GenericFileIcon,
    InternetIcon,
    PdfIcon,
    SelectedIcon,
    ShortcutIcon,
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
	[FILETYPE_EXECUTABLE]: "executable",
	[FILETYPE_GAME]: "game"
}

export const getIcon = (
	context: Context,
	props?: React.ImgHTMLAttributes<HTMLImageElement>,
	showSelectedIcon?: boolean,
	isShortcut?: boolean
): JSX.Element | null => {
	let icon: JSX.Element | null = null
	if (LEAF_EXTENSION_PROPERTY_NAME in context) {
		if (FILETYPE_CUSTOM_ICON in context && context.icon) {
			icon = <CustomIcon src={context.icon} {...props} />
		} else {
			switch (context.extension) {
				case FILETYPE_PDF:
					icon = <PdfIcon {...props} />
					break
				case FILETYPE_URL_SHORTCUT:
					icon = <InternetIcon {...props} />
					break
				case FILETYPE_TEXT:
					icon = <TextFileIcon {...props} />
					break
				case FILETYPE_EXECUTABLE:
					icon = <ExecutableFileIcon {...props} />
					break
				case FILETYPE_GAME:
					icon = <GameIcon {...props} />
					break
				case FILETYPE_SHORTCUT:
					if (SHORTCUT_DETERMINER in context) {
						icon = getIcon(context.context, props, showSelectedIcon, true)
						break
					}
					throw new Error("Invalid shortcut")
				default:
					icon = <GenericFileIcon {...props} />
					break
			}
		}
	} else if (BRANCHING_CONTEXT_TYPE_PROPERTY in context) {
		icon = <FolderIcon {...props} />
	} else {
		icon = <DriveIcon {...props} />
	}

	if (!icon) {
		return null
	}

	return (
		<div className="icon-container">
			{showSelectedIcon && <SelectedIcon {...props} className="icon-container__selected-icon" />}
			{icon}
			{isShortcut && <ShortcutIcon {...props} className="icon-container__shortcut-icon" />}
		</div>
	)

	return icon
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
		if (FILETYPE_CUSTOM_ICON in context && context.icon) {
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
