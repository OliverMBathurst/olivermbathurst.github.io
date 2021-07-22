import DirectoryIcon from '../../../../assets/icons/directoryIcon'
import FileBrowser from '../../../../system/apps/fileBrowser/fileBrowser'
import PDFViewer from "../../../../system/apps/pdfViewer/pdfViewer"
import WebBrowser from '../../../../system/apps/webBrowser/webBrowser'
import { WindowState, WindowType } from "../../../enums"
import { IApplicationHandler, IFile, IHydratedDirectory, IPDFFileContents, IUrlFileContents, IWindow } from "../../../interfaces"

class ApplicationHandler implements IApplicationHandler {
    invoke = (file: IFile | undefined): IWindow | null => {
        if (!file || !file.extension) {
            return null
        }

        var win: IWindow | null = null

        switch (file.extension.toUpperCase()) {
            case '.PDF':
                win = this.getNewPDFWindow(file)
                break
            case '.URL':
                win = this.getNewWebBrowserWindow(file)
                break
        }

        return win
    }

    invokeDirectoryHandler = (
        hydratedDirectory: IHydratedDirectory | undefined,
        getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined,
        onFileDoubleClicked: (id: string, driveId: string | undefined) => void): IWindow | null => {

        if (!hydratedDirectory) {
            return null
        }

        const elem = <FileBrowser dir={hydratedDirectory} getHydratedDirectory={getHydratedDirectory} onFileDoubleClicked={onFileDoubleClicked}/>

        return {
            id: 'window-temp',
            name: "File Browser",
            state: WindowState.Normal,
            element: elem,
            selected: true,
            size: { width: 500, height: 500 },
            position: { x: 0, y: 0 },
            type: WindowType.Directory,
            icon: <DirectoryIcon />
        }
    }

    getNewPDFWindow = (file: IFile): IWindow | null => {
        const contents = file.contents as IPDFFileContents
        if (contents) {
            const elem = <PDFViewer uri={contents.uri}/>
            return {
                ...file.windowParams,
                id: 'window-temp',
                name: `${file.name}${file.extension}`,
                state: WindowState.Normal,
                element: elem,
                selected: true,
                position: { x: 0, y: 0 },
                type: WindowType.File
            }
        }

        return null
    }

    getNewWebBrowserWindow = (file: IFile): IWindow | null => {
        const contents = file.contents as IUrlFileContents
        if (contents) {
            const elem = <WebBrowser url={contents.url} />
            return {
                ...file.windowParams,
                id: 'window-temp',
                name: `${file.name}${file.extension}`,
                state: WindowState.Normal,
                element: elem,
                selected: true,
                position: { x: 0, y: 0 },
                type: WindowType.File
            }
        }
        return null
    }
}

export default ApplicationHandler