import InternetIcon from "../../../../assets/icons/internetIcon"
import { OSItemType } from "../../../enums"
import { IDrive, IDriveManager, IFile, IHydratedDirectory, IIdHelper, IShortcut, IUrlFileContents, IVirtualDirectory } from "../../../interfaces"
import Drive from "./components/drive/drive"
import File from "./components/file/file"
import HydratedDirectory from "./components/hydratedDirectory/hydratedDirectory"
import Shortcut from "./components/shortcut/shortcut"
import VirtualDirectory from "./components/virtualDirectory/virtualDirectory"

class DriveManager implements IDriveManager {
    drives: IDrive[]

    constructor(idHelper: IIdHelper) {
        /*
        * Create dir structure here
        */
        const driveId = idHelper.getNewDriveId()

        var drive: IDrive = new Drive(driveId, 'C', true)

        var cvFileContents: IUrlFileContents = {
            url: 'https://raw.githubusercontent.com/OliverMBathurst/Curriculum-Vitae/master/Oliver%20Bathurst%20CV.pdf'
        }

        var gitHubFileContents: IUrlFileContents = {
            url: 'https://github.com/OliverMBathurst'
        }

        var linkedInFileContents: IUrlFileContents = {
            url: 'https://www.linkedin.com/in/oliverbathurst'
        }

        var cv: IFile = new File(
            idHelper.getNewFileId(driveId),
            'CV',
            '.url',
            cvFileContents,
            {
                icon: <InternetIcon />
            }
        )

        var gitHub: IFile = new File(
            idHelper.getNewFileId(driveId),
            'GitHub',
            '.url',
            gitHubFileContents,
            {
                icon: <InternetIcon />
            }
        )

        var linkedIn: IFile = new File(
            idHelper.getNewFileId(driveId),
            'LinkedIn',
            '.url',
            linkedInFileContents,
            {
                icon: <InternetIcon />
            }
        )

        var rootDummyFile: IFile = new File(idHelper.getNewFileId(driveId), 'Dummy', '.pdf', '')

        var rootId = idHelper.getNewDirectoryId(driveId)

        var shortcut: IShortcut = new Shortcut(idHelper.getNewShortcutId(driveId), 'system', rootId, OSItemType.DirectoryShortcut)

        var desktopDirectoryId = idHelper.getNewDirectoryId(driveId)
        var projectsDirectory: IVirtualDirectory = new VirtualDirectory(idHelper.getNewDirectoryId(driveId), 'projects', [], [], [], undefined, { root: false, parentId: desktopDirectoryId })
        var desktopDirectory: IVirtualDirectory = new VirtualDirectory(desktopDirectoryId, 'desktop', [cv.id, gitHub.id, linkedIn.id], [projectsDirectory.id], [shortcut.id])

        projectsDirectory.location = { parentId: desktopDirectory.id }

        var rootDirectory: IVirtualDirectory = new VirtualDirectory(rootId, 'system', [rootDummyFile.id], [desktopDirectory.id], [])

        rootDirectory.location = { root: true }

        desktopDirectory.location = { parentId: rootDirectory.id }

        globalThis.desktopDirectory = {
            id: desktopDirectoryId,
            driveId: drive.id
        }

        drive.addOrUpdateFiles([cv, gitHub, linkedIn, rootDummyFile])
        drive.addOrUpdateDirectories([rootDirectory, desktopDirectory, projectsDirectory])
        drive.addOrUpdateShortcuts([shortcut])

        this.drives = [drive]
    }

    getPrimaryDrive = (): IDrive | undefined => {
        return this.drives.find(x => x.primary)
    }

    getAllFiles = (): IFile[] => {
        var files: IFile[] = []

        for (var drive of this.drives) {
            files = files.concat(Array.from(drive.fileRepository.values()))
        }

        return files
    }

    getHydratedDirectory = (id: string, driveId: string | undefined): IHydratedDirectory | undefined => {
        var drive = this.drives.find(d => d.id === driveId)

        if (!drive) {
            return undefined
        }

        var dir = drive.virtualDirectoryRepository.get(id)
        if (!dir) {
            return undefined
        }

        var files: (IFile | undefined)[] = dir.files.map(f => drive!.fileRepository.get(f))
        var shortcuts: (IShortcut | undefined)[] = dir.shortcuts.map(s => drive!.shortcutRepository.get(s))
        var dirs: (IHydratedDirectory | undefined)[] = dir.directories.map(d => this.getHydratedDirectory(d, driveId))

        return new HydratedDirectory(dir.id, dir.name, drive.id, files, dirs, shortcuts, dir.location)
    }

    getDirectory = (id: string, driveId: string | undefined): IVirtualDirectory | undefined => driveId ? this.drives.find(d => d.id === driveId)?.virtualDirectoryRepository.get(id) : undefined

    getShortcut = (id: string, driveId: string | undefined): IShortcut | undefined => driveId ? this.drives.find(d => d.id === driveId)?.shortcutRepository.get(id) : undefined

    getFile = (id: string, driveId: string | undefined): IFile | undefined => driveId ? this.drives.find(d => d.id === driveId)?.fileRepository.get(id) : undefined
}

export default DriveManager