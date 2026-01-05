import { useCallback, useContext, useMemo, useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER, BRANCHING_CONTEXT_PARENT_PROPERTY, FILETYPE_RENDERABLE_PROPERTY, FILETYPE_URL_SHORTCUT, FILETYPE_URL_SHORTCUT_PROPERTY, LEAF_EXTENSION_PROPERTY_NAME, SHORTCUT_DETERMINER } from "../../constants"
import { WindowsContext } from "../../contexts"
import { IAddWindowProperties } from "../../interfaces/windows"
import { BranchingContext, Context } from "../../types/fs"
import { FileBrowserRow, UpOneLevelRow } from "./components"
import './fileBrowser.scss'

interface IFileBrowserProps {
    context: BranchingContext
    setWindowTopBarContext: (context: Context) => void
}

const FileBrowser = (props: IFileBrowserProps) => {
    const { context, setWindowTopBarContext } = props

    const [currentContext, setCurrentContext] = useState<BranchingContext>(context)
    const [selected, setSelected] = useState<string[]>([])

    const { addWindow } = useContext(WindowsContext)

    if (!(BRANCHING_CONTEXT_DETERMINER in context)) {
        throw new Error("File Browser invoked on non-branching Context")
    }

    const Entities = useMemo(() => {
        return [
            ...currentContext.branches,
            ...currentContext.shortcuts,
            ...currentContext.leaves
        ]
    }, [currentContext])

    const onRowDoubleClicked = useCallback((context: Context, _: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        let resolvedContext: Context = context
        if (SHORTCUT_DETERMINER in context) {
            resolvedContext = context.context
        }

        if (FILETYPE_URL_SHORTCUT_PROPERTY in resolvedContext
            && LEAF_EXTENSION_PROPERTY_NAME in resolvedContext
            && resolvedContext.extension === FILETYPE_URL_SHORTCUT) {
            window.open(resolvedContext.url, '_blank')
        } else if (FILETYPE_RENDERABLE_PROPERTY in resolvedContext) {
            const windowProperties: IAddWindowProperties = {
                context: resolvedContext,
                selected: true
            }

            addWindow(windowProperties)
        } else if (BRANCHING_CONTEXT_DETERMINER in resolvedContext) {
            setCurrentContext(resolvedContext)
            setWindowTopBarContext(resolvedContext)
        }
    }, [addWindow, setWindowTopBarContext])

    const onRowClicked = useCallback((context: Context, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const contextKey = context.toContextUniqueKey()

        if (e.shiftKey) {
            if (selected.length === 0) {
                setSelected([contextKey])
            } else {
                if (selected.length === 1 && selected[0] === contextKey) {
                    return
                }

                const identities = Entities.map(x => x.toContextUniqueKey())

                const initialSelectionIndex = identities.indexOf(selected[0])
                const newSelectionIndex = identities.indexOf(contextKey)

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
            if (selected.indexOf(contextKey) === -1) {
                setSelected(s => [...s, contextKey])
            } else {
                setSelected(s => [...s].filter(x => x !== contextKey))
            }
        } else {
            setSelected([contextKey])
        }
    }, [selected, Entities])

    const upOneLevel = () => {
        if (BRANCHING_CONTEXT_PARENT_PROPERTY in currentContext && currentContext.parent) {
            setCurrentContext(currentContext.parent)
            setWindowTopBarContext(currentContext.parent)
        }
    }

    return (
        <div className="file-browser">
            {BRANCHING_CONTEXT_PARENT_PROPERTY in currentContext && currentContext.parent && (
                <UpOneLevelRow
                    onRowDoubleClicked={upOneLevel}
                />)
            }
            {Entities.map(e => {
                const contextKey = e.toContextUniqueKey()
                return (
                    <FileBrowserRow
                        key={contextKey}
                        context={e}
                        selected={selected.indexOf(contextKey) !== -1}
                        onRowClicked={(ev) => onRowClicked(e, ev)}
                        onRowDoubleClicked={(ev) => onRowDoubleClicked(e, ev)}
                    />)
            })}
        </div>)
}

export default FileBrowser