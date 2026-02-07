import React from "react"
import ReactDOM from "react-dom/client"
import { Screen } from "./components/screen"
import {
    DesktopItemContextProvider,
    FileBrowserContextProvider,
    FileSystemContextProvider,
    RegistryContextProvider,
    TaskbarGroupContextProvider,
    WindowsContextProvider
} from "./contexts"
import "./scss/_index.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <React.StrictMode>
        <RegistryContextProvider>
            <FileSystemContextProvider>
                <WindowsContextProvider>
                    <DesktopItemContextProvider>
                        <FileBrowserContextProvider>
                            <TaskbarGroupContextProvider>
                                <Screen />
                            </TaskbarGroupContextProvider>
                        </FileBrowserContextProvider>
                    </DesktopItemContextProvider>
                </WindowsContextProvider>
            </FileSystemContextProvider>
        </RegistryContextProvider>
    </React.StrictMode>
)
