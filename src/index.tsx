import React from "react"
import ReactDOM from "react-dom/client"
import { Screen } from "./components/screen"
import { FileSystemContextProvider, WindowsContextProvider } from "./contexts"
import "./index.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
<React.StrictMode>
	<FileSystemContextProvider>
		<WindowsContextProvider>
			<Screen />
		</WindowsContextProvider>
	</FileSystemContextProvider>
</React.StrictMode>,
)
