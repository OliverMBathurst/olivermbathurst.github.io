import { createContext, useState } from "react"
import { FILE_BROWSER_APP_ID } from "../constants"
import { RegistryService } from "../services"

export interface IRegistryContext {
	applications: Record<string, string>
	applicationPaths: Record<string, string>
	specialBranchPaths: Record<string, string>
	fileTypeAssociations: Record<string, string>
	branchHandlerId: string
}

export const RegistryContext = createContext<IRegistryContext>({
	applications: {},
	applicationPaths: {},
	specialBranchPaths: {},
	fileTypeAssociations: {},
	branchHandlerId: FILE_BROWSER_APP_ID
})

interface IRegistryContextProviderProps {
	children: React.ReactNode
}

const defaultRegistry = new RegistryService().getDefaultRegistry()

const RegistryContextProvider = (props: IRegistryContextProviderProps) => {
	const { children } = props
	const [registry, _] = useState<IRegistryContext>(defaultRegistry)

	return (
		<RegistryContext.Provider
			value={{
				...registry
			}}
		>
			{children}
		</RegistryContext.Provider>
	)
}

export default RegistryContextProvider
