import { FILETYPE_PDF } from "../constants"
import { IRegistryContext } from "../contexts"

const DEFAULT_FOLDER_HANDLER_ID = "1"
const DEFAULT_FILETYPE_PDF_HANDLER_ID = "2"

class RegistryService {
    getDefaultRegistry(): IRegistryContext {
        return {
            applications: {
                [DEFAULT_FOLDER_HANDLER_ID]: "File Browser.exe",
                [DEFAULT_FILETYPE_PDF_HANDLER_ID]: "PDF Viewer.exe"
            },
            applicationPaths: {
                [DEFAULT_FOLDER_HANDLER_ID]: "Root\\Contents\\Applications\\File Browser.exe",
                [DEFAULT_FILETYPE_PDF_HANDLER_ID]: "Root\\Contents\\Applications\\PDF Viewer.exe"
            },
            fileTypeAssociations: {
                [DEFAULT_FILETYPE_PDF_HANDLER_ID]: FILETYPE_PDF
            },
            folderHandlerId: DEFAULT_FOLDER_HANDLER_ID
        }

    }
}

export default RegistryService