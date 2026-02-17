import React from "react"
import ReactDOM from "react-dom/client"
import { Screen } from "./components/screen"
import {
    DesktopItemContextProvider,
    FileSystemContextProvider,
    RegistryContextProvider,
    TaskbarGroupContextProvider,
    WindowsContextProvider,
    RecentsContextProvider
} from "./contexts"
import "./scss/_index.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <React.StrictMode>
        <RecentsContextProvider>
            <RegistryContextProvider>
                <FileSystemContextProvider>
                    <WindowsContextProvider>
                        <DesktopItemContextProvider>
                            <TaskbarGroupContextProvider>
                                <Screen />
                            </TaskbarGroupContextProvider>
                        </DesktopItemContextProvider>
                    </WindowsContextProvider>
                </FileSystemContextProvider>
            </RegistryContextProvider>
        </RecentsContextProvider>
    </React.StrictMode>
)
