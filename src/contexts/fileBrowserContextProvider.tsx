import { createContext, useState } from "react"

interface IFileBrowserContext {
    displaySettings: Record<string, boolean>
    toggleDisplaySetting: (windowId: string) => void
}

export const FileBrowserContext = createContext<IFileBrowserContext>({
    displaySettings: {},
    toggleDisplaySetting: (_: string) => Function.prototype
})

interface IFileBrowserContextProviderProps {
    children: React.ReactNode
}

const FileBrowserContextProvider = (props: IFileBrowserContextProviderProps) => {
    const { children } = props

    const [displaySettings, setDisplaySettings] = useState<Record<string, boolean>>({})

    const setDisplaySettingsInternal = (windowId: string) => {
        setDisplaySettings(r => {
            const prevValue = r[windowId] ?? true
            return {
                ...r,
                [windowId]: !prevValue
            }
        })
    }

    return (
        <FileBrowserContext.Provider value={{
            displaySettings: displaySettings,
            toggleDisplaySetting: setDisplaySettingsInternal
        }}>
            {children}
        </FileBrowserContext.Provider>
    )
}

export default FileBrowserContextProvider