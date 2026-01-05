import { useContext, useMemo } from 'react'
import { FileSystemContext } from '../../contexts'
import { SpecialBranch } from '../../enums'
import { useFileSystem } from '../../hooks'
import { File } from '../file'
import { Folder } from '../folder'
import { Shortcut } from '../shortcut'
import './desktop.scss'

const Desktop = () => {
    const { searchForBranchByType } = useFileSystem()
    const { root } = useContext(FileSystemContext)

    const desktopBranch = useMemo(() => {
        return searchForBranchByType(root, SpecialBranch.Desktop)
    }, [searchForBranchByType, root])

    return (
        <div className="desktop">
            <div className="desktop__grid">
                {desktopBranch?.branches.map(b => {
                    return <Folder key={b.name} context={b} />
                })}
                {desktopBranch?.shortcuts.map(s => {
                    return <Shortcut key={s.name} shortcut={s} />
                })}
                {desktopBranch?.leaves.map(l => {
                    const { name, extension } = l
                    return (
                        <File
                            key={`${name}${extension}`}
                            context={l}
                            executionContext={desktopBranch}
                        />
                    )
                })}
            </div>
        </div>)
}

export default Desktop