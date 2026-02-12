import DesktopItemContextProvider, {
    DesktopItemContext
} from "./desktopItemContextProvider"
import FileBrowserContextProvider, {
    FileBrowserContext
} from "./fileBrowserContextProvider"
import FileSystemContextProvider, {
    FileSystemContext
} from "./fileSystemContextProvider"
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
import RecentsContextProvider, { RecentsContext } from "./recentsContextProvider"

export {
    DesktopItemContext,
    DesktopItemContextProvider,
    FileBrowserContext,
    FileBrowserContextProvider,
    FileSystemContext,
    FileSystemContextProvider,
    RegistryContext,
    RegistryContextProvider,
    TaskbarGroupContext,
    TaskbarGroupContextProvider, WallpaperContext, WallpaperContextProvider, WindowsContext,
    WindowsContextProvider,
    RecentsContextProvider,
    RecentsContext
}

export type { IRegistryContext }
