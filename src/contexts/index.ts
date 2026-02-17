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
import TaskbarGroupContextProvider, {
    TaskbarGroupContext
} from "./taskbarGroupContextProvider"
import WallpaperContextProvider, { WallpaperContext } from "./wallpaperContextProvider"
import WindowsContextProvider, {
    WindowsContext
} from "./windowsContextProvider"

export {
    DesktopItemContext,
    DesktopItemContextProvider,
    FileSystemContext,
    FileSystemContextProvider, RecentsContext, RecentsContextProvider, RegistryContext,
    RegistryContextProvider,
    TaskbarGroupContext,
    TaskbarGroupContextProvider, WallpaperContext, WallpaperContextProvider, WindowsContext,
    WindowsContextProvider
}

export type { IRegistryContext }
