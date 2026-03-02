import ContextMenuContextProvider, {
    ContextMenuContext
} from "./contextMenuContextProvider"
import DesktopItemContextProvider, {
    DesktopItemContext
} from "./desktopItemContextProvider"
import FileSystemContextProvider, {
    FileSystemContext
} from "./fileSystemContextProvider"
import RecentsContextProvider, { RecentsContext } from "./recentsContextProvider"
import RegistryContextProvider, {
    IRegistryContext,
    RegistryContext
} from "./registryContextProvider"
import TaskbarContextProvider, { TaskbarContext } from "./taskbarContextProvider"
import TaskbarGroupContextProvider, {
    TaskbarGroupContext
} from "./taskbarGroupContextProvider"
import WallpaperContextProvider, { WallpaperContext } from "./wallpaperContextProvider"
import WindowsContextProvider, {
    WindowsContext
} from "./windowsContextProvider"

export {
    ContextMenuContext, ContextMenuContextProvider, DesktopItemContext,
    DesktopItemContextProvider,
    FileSystemContext,
    FileSystemContextProvider, RecentsContext, RecentsContextProvider, RegistryContext,
    RegistryContextProvider, TaskbarContext, TaskbarContextProvider, TaskbarGroupContext,
    TaskbarGroupContextProvider, WallpaperContext, WallpaperContextProvider, WindowsContext,
    WindowsContextProvider
}

interface IContextProviderProps {
    children: React.ReactNode
}

export type { IContextProviderProps, IRegistryContext }
