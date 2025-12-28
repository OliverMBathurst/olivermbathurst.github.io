import { useContext, useMemo } from 'react'
import { FileSystemContext } from '../../../contexts'
import { DirectoryType } from '../../../enums'
import useFileSystem from '../../../hooks/fileSystem'
import { File } from '../../file'
import './desktopGrid.scss'

const DesktopGrid = () => {
    const { searchByDirectoryType } = useFileSystem()
    const { rootDirectory } = useContext(FileSystemContext)

    const desktopDirectory = useMemo(() => {
        return searchByDirectoryType(rootDirectory, DirectoryType.Desktop)
    }, [searchByDirectoryType, rootDirectory])

    return (
        <div className="desktop__grid">
            {desktopDirectory?.files.map((fi, i) => <File key={i} fileInfo={fi} />)}
        </div>)
}

export default DesktopGrid