import { createContext, useState } from "react";
import { IContextProviderProps } from ".";

interface IContextMenuContext {
    openContextMenuId: string | null
    closeContextMenu: (key: string) => void
    openContextMenu: (key: string) => void
    closeAllContextMenus: () => void
}

export const ContextMenuContext = createContext<IContextMenuContext>({
    openContextMenuId: null,
    closeContextMenu: (_: string) => Function.prototype,
    openContextMenu: (_: string) => Function.prototype,
    closeAllContextMenus: () => Function.prototype
})

const ContextMenuContextProvider = (props: IContextProviderProps) => {
    const { children } = props
    const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null)

    const closeContextMenu = (key: string) => {
        setOpenContextMenuId(ocmid => {
            if (ocmid === key) {
                return null
            }

            return ocmid
        })
    }

    const openContextMenu = (key: string) => setOpenContextMenuId(key)

    const closeAllContextMenus = () => setOpenContextMenuId(null)

    return (
        <ContextMenuContext.Provider value={{
            openContextMenuId,
            openContextMenu,
            closeContextMenu,
            closeAllContextMenus
        }}>
            {children}
        </ContextMenuContext.Provider>
    )
}

export default ContextMenuContextProvider