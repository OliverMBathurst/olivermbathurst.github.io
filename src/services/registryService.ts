import { DOS_VIEWER_APP_ID, FILETYPE_DOS, FILETYPE_PDF, FILETYPE_TEXT, FILE_BROWSER_APP_ID, PDF_VIEWER_APP_ID, TEXT_VIEWER_APP_ID } from "../constants"
import { IRegistryContext } from "../contexts"
import { SpecialBranch } from "../enums"

class RegistryService {
    getDefaultRegistry(): IRegistryContext {
        return {
            applications: {
                [FILE_BROWSER_APP_ID]: "File Browser.exe",
                [PDF_VIEWER_APP_ID]: "PDF Viewer.exe",
                [TEXT_VIEWER_APP_ID]: "Monaco Editor.exe",
                [DOS_VIEWER_APP_ID]: "JS-DOS Player.exe"
            },
            applicationPaths: {
                [FILE_BROWSER_APP_ID]: "Root\\Contents\\Applications\\File Browser.exe",
                [PDF_VIEWER_APP_ID]: "Root\\Contents\\Applications\\PDF Viewer.exe",
                [TEXT_VIEWER_APP_ID]: "Root\\Contents\\Applications\\Monaco Editor.exe",
                [DOS_VIEWER_APP_ID]: "Root\\Contents\\Applications\\JS-DOS Player.exe"
            },
            specialBranchPaths: {
                [SpecialBranch.Desktop]: "Root\\Contents\\Desktop"
            },
            fileTypeAssociations: {
                [PDF_VIEWER_APP_ID]: FILETYPE_PDF,
                [TEXT_VIEWER_APP_ID]: FILETYPE_TEXT,
                [DOS_VIEWER_APP_ID]: FILETYPE_DOS
            },
            branchHandlerId: FILE_BROWSER_APP_ID
        }
    }
}

export default RegistryService