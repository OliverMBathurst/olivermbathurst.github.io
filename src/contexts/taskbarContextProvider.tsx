import { createContext, useContext, useEffect, useState } from "react"
import { IContextProviderProps, RegistryContext } from "."
import { BRANCHING_CONTEXT_DETERMINER } from "../constants"
import { SpecialBranch } from "../enums"
import { useFileSystem } from "../hooks"
import { Shortcut } from "../types/fs"

interface ITaskbarContext {
    pinnedTaskbarItems: Shortcut[]
}

export const TaskbarContext = createContext<ITaskbarContext>({
    pinnedTaskbarItems: []
})

const TaskbarContextProvider = (props: IContextProviderProps) => {
    const { children } = props
    const { specialBranchPaths } = useContext(RegistryContext)
    const { validateFilePath } = useFileSystem()

    const [pinnedTaskbarItems, setPinnedTaskbarItems] = useState<Shortcut[]>([])

    useEffect(() => {
        const path = specialBranchPaths[SpecialBranch.Taskbar]
        if (!path) {
            return
        }

        const validatedContext = validateFilePath(path)
        if (!validatedContext || !(BRANCHING_CONTEXT_DETERMINER in validatedContext)) {
            return
        }

        setPinnedTaskbarItems(validatedContext.shortcuts)
    }, [specialBranchPaths, validateFilePath, setPinnedTaskbarItems])

    return (
        <TaskbarContext.Provider
            value={{ pinnedTaskbarItems }}
        >
            {children}
        </TaskbarContext.Provider>
    )
}

export default TaskbarContextProvider