import { IUrlShortcutFile } from '../interfaces/file'

class GitHub implements IUrlShortcutFile {
    url: string = "https://github.com/OliverMBathurst"
    name: string = "My GitHub"
    extension: string = ".url"
}

export default GitHub