import { createContext, useState } from "react"
import RegistryService from "../service/registryService"

export interface IRegistryContext {
    applications: Record<string, string>
    applicationPaths: Record<string, string>
    fileTypeAssociations: Record<string, string>
    folderHandlerId: string
}

export const RegistryContext = createContext<IRegistryContext>({
    applications: {},
    applicationPaths: {},
    fileTypeAssociations: {},
    folderHandlerId: ""
})

interface IRegistryContextProviderProps {
    children: React.ReactNode
}

const defaultRegistry = new RegistryService().getDefaultRegistry()

const RegistryContextProvider = (props: IRegistryContextProviderProps) => {
    const { children } = props
    const [registry, _] = useState<IRegistryContext>(defaultRegistry)

    return (
        <RegistryContext.Provider value={{
            ...registry
        }}>
            {children}
        </RegistryContext.Provider>)
}

export default RegistryContextProvider