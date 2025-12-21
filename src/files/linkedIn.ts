import { IUrlShortcutFile } from '../interfaces/file'

class LinkedIn implements IUrlShortcutFile {
    url: string = "https://www.linkedin.com/in/oliverbathurst/"
    name: string = "My LinkedIn"
    extension: string = ".url"
}

export default LinkedIn