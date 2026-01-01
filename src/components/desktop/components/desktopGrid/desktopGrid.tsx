import { useContext, useMemo } from 'react'
import { FileSystemContext } from '../../../../contexts'
import { BranchType } from '../../../../enums'
import useFileSystem from '../../../../hooks/fileSystem'
import { File } from '../../../file'
import { Folder } from '../../../folder'
import { Shortcut } from '../../../shortcut'
import './desktopGrid.scss'

const DesktopGrid = () => {
    const { searchForBranchByType } = useFileSystem()
    const { root } = useContext(FileSystemContext)

    const desktopBranch = useMemo(() => {
        return searchForBranchByType(root, BranchType.Desktop)
    }, [searchForBranchByType, root])

    return (
        <div className="desktop__grid">
            {desktopBranch?.branches.map(b => {
                return <Folder key={b.name} node={b} />
            })}
            {desktopBranch?.shortcuts.map(s => {
                return <Shortcut key={s.name} node={s} />
            })}
            {desktopBranch?.leaves.map(l => {
                const { name, extension } = l
                return (
                    <File
                        key={`${name}${extension}`}
                        node={l}
                        executionContext={desktopBranch}
                    />
                )
            })}
        </div>)
}

export default DesktopGrid