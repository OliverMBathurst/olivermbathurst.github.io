import { createContext, useState } from "react"
import { RECENTS_LIMIT } from "../constants"

interface IRecentContextInformation {
    path: string
    time: number
}

interface IRecentsContext {
    recents: IRecentContextInformation[]
    addRecentContext: (path: string) => void
}

export const RecentsContext = createContext<IRecentsContext>({
    recents: [],
    addRecentContext: (_: string) => Function.prototype
})

interface IRecentsContextProviderProps {
    children: React.ReactNode
}

const RecentsContextProvider = (props: IRecentsContextProviderProps) => {
    const { children } = props
    const [recents, setRecents] = useState<IRecentContextInformation[]>([])

    const addRecentContext = (path: string) => {
        const newRecents = [...recents]

        const foundRecentIdx = newRecents.findIndex(x => x.path === path)
        if (foundRecentIdx !== -1) {
            newRecents.splice(foundRecentIdx, 1)
        }

        const newRecent = {
            path: path,
            time: Date.now()
        }

        if (newRecents.length === RECENTS_LIMIT) {
            newRecents[0] = newRecent
        } else {
            newRecents.unshift(newRecent)
        }

        setRecents(newRecents)
    }

    return (
        <RecentsContext.Provider value={{
            recents,
            addRecentContext
        }}>
            {children}
        </RecentsContext.Provider>
    )
}

export default RecentsContextProvider