import DirectoryIcon from '../../../../assets/icons/directoryIcon'
import FileBrowser from '../../../../system/apps/fileBrowser/fileBrowser'
import { WindowState, WindowType } from "../../../enums"
import { IApplicationHandler, IFile, IGenericFileContents, IHydratedDirectory, IUrlFileContents, IWindow } from "../../../interfaces"

class ApplicationHandler implements IApplicationHandler {
    invoke = (file: IFile | undefined): IWindow | null => {
        if (!file || !file.extension) {
            return null
        }

        var win: IWindow | null = null

        switch (file.extension.toUpperCase()) {
            case '.URL':
                //win = this.getNewWebBrowserWindow(file)
                var contents = file.contents as IUrlFileContents
                if (contents) {
                    window.open(contents.url, '_blank')
                }
                break
            case ".TXT":
                win = this.getGenericWindow(file)
                break
        }

        return win
    }

    invokeDirectoryHandler = (
        hydratedDirectory: IHydratedDirectory | undefined,
        getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined,
        onFileDoubleClicked: (id: string, driveId: string | undefined) => void,
        onWindowNameChanged: (id: string, newName: string) => void): IWindow | null => {

        if (!hydratedDirectory) {
            return null
        }

        const elem = <FileBrowser
            dir={hydratedDirectory}
            getHydratedDirectory={getHydratedDirectory}
            onFileDoubleClicked={onFileDoubleClicked}
            onWindowNameChanged={onWindowNameChanged} />

        var windowName = hydratedDirectory?.name ? hydratedDirectory.name : "File Browser"

        return {
            id: 'window-temp',
            name: windowName,
            state: WindowState.Normal,
            element: elem,
            selected: true,
            size: { width: 500, height: 500 },
            position: { x: 0, y: 0 },
            type: WindowType.Directory,
            icon: <DirectoryIcon />
        }
    }

    getGenericWindow = (file: IFile): IWindow | null => {
        const contents = file.contents as IGenericFileContents
        if (contents) {
            return {
                ...file.windowParams,
                id: 'window-temp',
                name: `${file.name}${file.extension}`,
                state: WindowState.Normal,
                element: contents.element,
                selected: true,
                position: { x: 0, y: 0 },
                type: WindowType.File
            }
        }
        return null
    }
}

export default ApplicationHandler