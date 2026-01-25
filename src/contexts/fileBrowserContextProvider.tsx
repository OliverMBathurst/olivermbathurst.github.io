import { createContext, useState } from "react"
import { BranchingContext } from "../types/fs"

interface IFileBrowserContext {
    displaySettings: Record<string, boolean>
    historyPointers: Record<string, number>
    navigationHistory: Record<string, BranchingContext[]>
    treeSelectedContextKeys: Record<string, string[]>
    treeOpenFolderContextKeys: Record<string, string[]>
    toggleDisplaySetting: (windowId: string) => void
    addNavigationHistory: (windowId: string, context: BranchingContext) => void
    addToHistoryPointer: (windowId: string) => void
    subtractFromHistoryPointer: (windowId: string) => void
    setNavigationHistoryForWindow: (windowId: string, updateFn: (history: BranchingContext[]) => BranchingContext[]) => void
    setTreeOpenFolderContextKeysForWindow: (windowId: string, updateFn: (contextKeys: string[]) => string[]) => void
    setSelectedTreeContextKeysForWindow: (windowId: string, updateFn: (contextKeys: string[]) => string[]) => void
}

export const FileBrowserContext = createContext<IFileBrowserContext>({
    displaySettings: {},
    historyPointers: {},
    navigationHistory: {},
    treeSelectedContextKeys: {},
    treeOpenFolderContextKeys: {},
    toggleDisplaySetting: (_: string) => Function.prototype,
    addNavigationHistory: (_: string, __: BranchingContext) => Function.prototype,
    addToHistoryPointer: (_: string) => Function.prototype,
    subtractFromHistoryPointer: (_: string) => Function.prototype,
    setNavigationHistoryForWindow: (_: string, __: (history: BranchingContext[]) => BranchingContext[]) => Function.prototype,
    setSelectedTreeContextKeysForWindow: (_: string, __: (contextKeys: string[]) => string[]) => Function.prototype,
    setTreeOpenFolderContextKeysForWindow: (_: string, __: (contextKeys: string[]) => string[]) => Function.prototype
})

interface IFileBrowserContextProviderProps {
    children: React.ReactNode
}

const FileBrowserContextProvider = (props: IFileBrowserContextProviderProps) => {
    const { children } = props

    const [displaySettings, setDisplaySettings] = useState<Record<string, boolean>>({})
    const [navigationHistory, setNavigationHistory] = useState<Record<string, BranchingContext[]>>({})
    const [historyPointers, setHistoryPointers] = useState<Record<string, number>>({})
    const [treeSelectedContextKeys, setTreeSelectedContextKeys] = useState<Record<string, string[]>>({})
    const [treeOpenFolderContextKeys, setTreeOpenFolderContextKeys] = useState<Record<string, string[]>>({})

    const setDisplaySettingsInternal = (windowId: string) => {
        const prev = displaySettings[windowId] ?? true

        setDisplaySettings(r => {
            return {
                ...r,
                [windowId]: !prev
            }
        })
    }

    const addNavigationHistory = (windowId: string, context: BranchingContext) => {
        const prev = navigationHistory[windowId] ?? []

        prev.push(context)

        setNavigationHistory(r => {
            return {
                ...r,
                [windowId]: prev
            }
        })

        const hp = historyPointers[windowId] ?? 0

        if (hp === 0 && prev.length === 1) {
            return
        }

        setHistoryPointers(hps => {
            return {
                ...hps,
                [windowId]: hp + 1
            }
        })
    }

    const addToHistoryPointer = (windowId: string) => {
        let prev = historyPointers[windowId] ?? 0

        prev++

        setHistoryPointers(r => {
            return {
                ...r,
                [windowId]: prev
            }
        })
    }

    const subtractFromHistoryPointer = (windowId: string) => {
        let prev = historyPointers[windowId] ?? 0

        prev = prev > 0 ? prev - 1 : 0

        setHistoryPointers(r => {
            return {
                ...r,
                [windowId]: prev
            }
        })
    }

    const setNavigationHistoryForWindow = (windowId: string, updateFn: (history: BranchingContext[]) => BranchingContext[]) => {
        let prev = navigationHistory[windowId] ?? []
        prev = updateFn(prev)

        setNavigationHistory(nh => {
            return {
                ...nh,
                [windowId]: prev
            }
        })
    }

    const setSelectedTreeContextKeysForWindow = (windowId: string, updateFn: (contextKeys: string[]) => string[]) => {
        let prev = treeSelectedContextKeys[windowId] ?? []
        prev = updateFn(prev)

        setTreeSelectedContextKeys(ck => {
            return {
                ...ck,
                [windowId]: prev
            }
        })
    }

    const setTreeOpenFolderContextKeysForWindow = (windowId: string, updateFn: (contextKeys: string[]) => string[]) => {
        let prev = treeOpenFolderContextKeys[windowId] ?? []
        prev = updateFn(prev)

        setTreeOpenFolderContextKeys(ck => {
            return {
                ...ck,
                [windowId]: prev
            }
        })
    }

    return (
        <FileBrowserContext.Provider value={{
            displaySettings,
            navigationHistory,
            historyPointers,
            treeOpenFolderContextKeys,
            toggleDisplaySetting: setDisplaySettingsInternal,
            addNavigationHistory,
            addToHistoryPointer,
            subtractFromHistoryPointer,
            setNavigationHistoryForWindow,
            treeSelectedContextKeys,
            setSelectedTreeContextKeysForWindow,
            setTreeOpenFolderContextKeysForWindow
        }}>
            {children}
        </FileBrowserContext.Provider>
    )
}

export default FileBrowserContextProvider