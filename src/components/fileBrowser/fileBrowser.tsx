import { BRANCHING_NODE_DETERMINER } from "../../constants"
import { Node } from "../../types/fs"
import { FileBrowserRow } from "./components"
import './fileBrowser.scss'

interface IFileBrowserProps {
    node: Node
}

const FileBrowser = (props: IFileBrowserProps) => {
    const { node } = props

    if (!(BRANCHING_NODE_DETERMINER in node)) {
        throw new Error("File Browser invoked on non-branching Node")
    }

    const onRowDoubleClicked = (node: Node) => { }

    const onRowClicked = (node: Node) => { }

    return (
        <div className="file-browser">
            {node.branches.map(b => {
                return (
                    <FileBrowserRow
                        key={b.name}
                        node={b}
                        selected={false}
                        onRowClicked={() => onRowClicked(b)}
                        onRowDoubleClicked={() => onRowDoubleClicked(b)}
                    />)
            })}
            {node.shortcuts.map(s => {
                return (
                    <FileBrowserRow
                        key={`${s.name} (Shortcut)`}
                        node={s}
                        selected={false}
                        onRowClicked={() => onRowClicked(s)}
                        onRowDoubleClicked={() => onRowDoubleClicked(s)}
                    />)
            })}
            {node.leaves.map(l => {
                const { name, extension } = l
                return (
                    <FileBrowserRow
                        key={`${name}${extension}`}
                        node={l}
                        selected={false}
                        onRowClicked={() => onRowClicked(l)}
                        onRowDoubleClicked={() => onRowDoubleClicked(l)}
                    />)
            })}
        </div>)
}

export default FileBrowser