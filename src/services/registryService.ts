import {
    FILETYPE_GAME,
    FILETYPE_PDF,
    FILETYPE_TEXT,
    FILE_BROWSER_APP_ID,
    GAME_VIEWER_APP_ID,
    PDF_VIEWER_APP_ID,
    PHOTO_VIEWER_APP_ID,
    SUPPORTED_IMAGE_EXTENSIONS,
    TEXT_VIEWER_APP_ID
} from "../constants"
import { IRegistryContext } from "../contexts"
import { SpecialBranch } from "../enums"

class RegistryService {
	getDefaultRegistry(): IRegistryContext {
		return {
			applications: {
				[FILE_BROWSER_APP_ID]: "File Browser.exe",
				[PDF_VIEWER_APP_ID]: "PDF Viewer.exe",
				[TEXT_VIEWER_APP_ID]: "Monaco Editor.exe",
				[GAME_VIEWER_APP_ID]: "Game Player.exe",
				[PHOTO_VIEWER_APP_ID]: "Photo Viewer.exe"
			},
			applicationPaths: {
				[FILE_BROWSER_APP_ID]: "Root\\Applications\\File Browser.exe",
				[PDF_VIEWER_APP_ID]: "Root\\Applications\\PDF Viewer.exe",
				[TEXT_VIEWER_APP_ID]: "Root\\Applications\\Monaco Editor.exe",
				[GAME_VIEWER_APP_ID]: "Root\\Applications\\Game Player.exe",
				[PHOTO_VIEWER_APP_ID]: "Root\\Applications\\Photo Viewer.exe"
			},
			specialBranchPaths: {
				[SpecialBranch.Desktop]: "Root\\Desktop",
				[SpecialBranch.StartMenu]: "Root\\Start Menu"
			},
			fileTypeAssociations: {
				[PDF_VIEWER_APP_ID]: FILETYPE_PDF,
				[TEXT_VIEWER_APP_ID]: FILETYPE_TEXT,
				[GAME_VIEWER_APP_ID]: FILETYPE_GAME,
				[PHOTO_VIEWER_APP_ID]: SUPPORTED_IMAGE_EXTENSIONS.join(",")
			},
			branchHandlerId: FILE_BROWSER_APP_ID
		}
	}
}

export default RegistryService
