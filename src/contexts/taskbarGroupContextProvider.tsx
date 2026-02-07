import { createContext, useState } from "react"

interface ITaskbarGroupContext {
    openGroupHandlerId: string | null
    setOpenGroupHandlerId: (handlerId: string) => void
}

export const TaskbarGroupContext = createContext<ITaskbarGroupContext>({
    openGroupHandlerId: null,
    setOpenGroupHandlerId: (_: string) => Function.prototype
})

interface ITaskbarGroupContextProviderProps {
    children: React.ReactNode
}

const TaskbarGroupContextProvider = (props: ITaskbarGroupContextProviderProps) => {
    const { children } = props
    const [openGroupHandlerId, setOpenGroupHandlerId] = useState<string | null>(null)

    return (
        <TaskbarGroupContext.Provider value={{
            openGroupHandlerId,
            setOpenGroupHandlerId
        }}>
            {children}
        </TaskbarGroupContext.Provider>
    )
}

export default TaskbarGroupContextProvider