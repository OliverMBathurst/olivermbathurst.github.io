import { MouseEvent, useCallback, useContext, useMemo, useState } from "react"
import { BRANCHING_NODE_DETERMINER, BRANCHING_NODE_PARENT_PROPERTY } from "../../constants"
import { WindowsContext } from "../../contexts"
import { NodeType } from "../../enums"
import { resolveNodeSelection } from "../../helpers"
import { IAddWindowProperties } from "../../interfaces/windows"
import { BranchingNode, Node } from "../../types/fs"
import { FileBrowserRow, UpOneLevelRow } from "./components"
import './fileBrowser.scss'

interface IFileBrowserProps {
    node: BranchingNode
    setWindowTopBarContext: (context: Node) => void
}

const FileBrowser = (props: IFileBrowserProps) => {
    const { node, setWindowTopBarContext } = props

    const [currentNode, setCurrentNode] = useState<BranchingNode>(node)
    const [selected, setSelected] = useState<string[]>([])

    const { addWindow } = useContext(WindowsContext)

    if (!(BRANCHING_NODE_DETERMINER in node)) {
        throw new Error("File Browser invoked on non-branching Node")
    }

    const Entities = useMemo(() => {
        return [
            ...currentNode.branches,
            ...currentNode.shortcuts,
            ...currentNode.leaves
        ]
    }, [currentNode])

    const onRowDoubleClicked = useCallback((node: Node, _: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        const { alreadyResolved, resolvedNode, nodeType } = resolveNodeSelection(node)
        if (alreadyResolved) {
            return
        }

        if (!resolvedNode) {
            throw new Error("Failed to resolve Node")
        }

        if (nodeType === NodeType.Renderable) {
            const windowProperties: IAddWindowProperties = {
                context: resolvedNode,
                selected: true
            }

            addWindow(windowProperties)
        } else if (BRANCHING_NODE_DETERMINER in resolvedNode) {
            setCurrentNode(resolvedNode)
            setWindowTopBarContext(resolvedNode)
        }
    }, [addWindow, setWindowTopBarContext])

    const onRowClicked = useCallback((node: Node, e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        const nodeKey = node.toContextUniqueKey()

        if (e.shiftKey) {
            if (selected.length === 0) {
                setSelected([nodeKey])
            } else {
                if (selected.length === 1 && selected[0] === nodeKey) {
                    return
                }

                const identities = Entities.map(x => x.toContextUniqueKey())

                const initialSelectionIndex = identities.indexOf(selected[0])
                const newSelectionIndex = identities.indexOf(nodeKey)

                const newSelection: string[] = [selected[0]]

                if (newSelectionIndex > initialSelectionIndex) {
                    for (let i = initialSelectionIndex + 1; i <= newSelectionIndex; i++) {
                        newSelection.push(identities[i])
                    }
                } else {
                    for (let i = newSelectionIndex; i < initialSelectionIndex; i++) {
                        newSelection.push(identities[i])
                    }
                }

                setSelected(newSelection)
            }
        } else if (e.ctrlKey) {
            if (selected.indexOf(nodeKey) === -1) {
                setSelected(s => [...s, nodeKey])
            } else {
                setSelected(s => [...s].filter(x => x !== nodeKey))
            }
        } else {
            setSelected([nodeKey])
        }
    }, [selected, Entities])

    const upOneLevel = () => {
        if (BRANCHING_NODE_PARENT_PROPERTY in currentNode && currentNode.parent) {
            setCurrentNode(currentNode.parent)
            setWindowTopBarContext(currentNode.parent)
        }
    }

    return (
        <div className="file-browser">
            {BRANCHING_NODE_PARENT_PROPERTY in currentNode && currentNode.parent && (
                <UpOneLevelRow
                    onRowDoubleClicked={upOneLevel}
                />)
            }
            {Entities.map(e => {
                const nodeKey = e.toContextUniqueKey()
                return (
                    <FileBrowserRow
                        key={nodeKey}
                        node={e}
                        selected={selected.indexOf(nodeKey) !== -1}
                        onRowClicked={(ev) => onRowClicked(e, ev)}
                        onRowDoubleClicked={(ev) => onRowDoubleClicked(e, ev)}
                    />)
            })}
        </div>)
}

export default FileBrowser