import { createContext, useState } from "react"
import { IContextProviderProps } from "."

interface ITaskbarGroupContext {
	openGroupHandlerId: string | null
	setOpenGroupHandlerId: (handlerId: string) => void
}

export const TaskbarGroupContext = createContext<ITaskbarGroupContext>({
	openGroupHandlerId: null,
	setOpenGroupHandlerId: (_: string) => Function.prototype
})

const TaskbarGroupContextProvider = (
	props: IContextProviderProps
) => {
	const { children } = props
	const [openGroupHandlerId, setOpenGroupHandlerId] = useState<string | null>(
		null
	)

	return (
		<TaskbarGroupContext.Provider
			value={{
				openGroupHandlerId,
				setOpenGroupHandlerId
			}}
		>
			{children}
		</TaskbarGroupContext.Provider>
	)
}

export default TaskbarGroupContextProvider
