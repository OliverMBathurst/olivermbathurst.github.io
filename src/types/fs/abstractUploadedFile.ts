import { IAbstractUploadedWindowFile } from "../../interfaces/fs"

abstract class AbstractUploadedWindowFile implements IAbstractUploadedWindowFile {
    _data: string | null = null
    _icon: string | null = null
    name: string
    fullName: string
    extension: string
    path: string
    epoch: number
    
    constructor(
        name: string,
        fullName: string,
        path: string,
        openTime: number,
        extension: string
    ) {
        this.name = name
        this.fullName = fullName
        this.path = path
        this.epoch = openTime
        this.extension = extension
    }
    
    get data() {
        return this._data
    }

    set data(_data: string | null) {
        this._data = _data
    }

    get icon() {
        return this._icon
    }

    set icon(icon: string | null) {
        this._icon = icon
    }

    toContextUniqueKey = () => `${this.path}-${this.epoch}`
}

export default AbstractUploadedWindowFile