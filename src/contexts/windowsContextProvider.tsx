import React, { createContext, useState } from "react"
import {
	IAddWindowProperties,
	IWindowProperties,
	WindowState
} from "../interfaces/windows"

interface IWindowsContext {
	windowProperties: IWindowProperties[]
	addWindow: (window: IAddWindowProperties) => void
	removeWindow: (windowId: string) => void
	onMinimizeAllButtonClicked: () => void
	onWindowStateChanged: (windowId: string, newState: WindowState) => void
	onTaskbarItemClicked: (windowId: string) => void
	onWindowSelected: (windowId: string) => void
}

export const WindowsContext: React.Context<IWindowsContext> =
	createContext<IWindowsContext>({
		windowProperties: [],
		addWindow: (_: IAddWindowProperties) => Function.prototype,
		removeWindow: (_: string) => Function.prototype,
		onMinimizeAllButtonClicked: () => Function.prototype,
		onWindowStateChanged: (_: string, __: WindowState) => Function.prototype,
		onTaskbarItemClicked: (_: string) => Function.prototype,
		onWindowSelected: (_: string) => Function.prototype
	})

interface IWindowsContextProviderProps {
	children: React.ReactNode
}

const WindowsContextProvider = (props: IWindowsContextProviderProps) => {
	const { children } = props
	const [windowProperties, setWindowProperties] = useState<IWindowProperties[]>(
		[]
	)

	const addWindow = (properties: IAddWindowProperties) => {
		const { context, size, selected } = properties

		const defaultWindowSize = window.innerHeight / 2

		const windowSize = size ?? { width: defaultWindowSize, height: defaultWindowSize }

		const newWindowProperties: IWindowProperties = {
			id: `${Date.now()}-${context.name}`,
			context: context,
			selected: selected ?? true,
			size: windowSize,
			state: WindowState.Normal,
			previousState: null
		}

		const existingWindows = windowProperties.map((wp) => {
			return {
				...wp,
				selected: false
			}
		})

		setWindowProperties([...existingWindows, newWindowProperties])
	}

	const onMinimizeAllButtonClicked = () => {
		setWindowProperties([
			...windowProperties.map((x) => {
				return {
					...x,
					selected: false,
					previousState: x.state,
					state: WindowState.Minimised
				}
			})
		])
	}

	const onWindowStateChanged = (windowId: string, newState: WindowState) => {
		const newWindows = [...windowProperties]
		const targetWindowIndex = newWindows.findIndex((x) => x.id === windowId)
		if (targetWindowIndex !== -1) {
			let existingWindow = newWindows[targetWindowIndex]

			let newWindow = {
				...existingWindow,
				previousState: existingWindow.state,
				state: newState,
				selected:
					newState === WindowState.Minimised
						? false
						: newWindows[targetWindowIndex].selected
			}
			newWindows[targetWindowIndex] = newWindow
			setWindowProperties(newWindows)
		}
	}

	const onTaskbarItemClicked = (windowId: string) => {
		let newWindows = [...windowProperties]
		const targetWindowIndex = newWindows.findIndex((x) => x.id === windowId)
		if (targetWindowIndex !== -1) {
			let existingWindow = newWindows[targetWindowIndex]
			if (existingWindow.state === WindowState.Minimised) {
				existingWindow.state =
					existingWindow.previousState ?? WindowState.Normal
				existingWindow.selected = true
			} else {
				if (existingWindow.selected) {
					existingWindow.previousState = existingWindow.state
					existingWindow.state = WindowState.Minimised
					existingWindow.selected = false
				} else {
					existingWindow.selected = true
				}
			}

			if (existingWindow.selected) {
				newWindows = newWindows.map((w) => {
					return {
						...w,
						selected: false
					}
				})
			}

			newWindows[targetWindowIndex] = { ...existingWindow }
			setWindowProperties(newWindows)
		}
	}

	const onWindowSelected = (windowId: string) => {
		const existingWindow = windowProperties.find((wp) => wp.id === windowId)
		const otherWindowsAreSelected = windowProperties
			.filter((wp) => wp.id !== windowId)
			.find((wp) => wp.selected)

		if (existingWindow && existingWindow.selected && !otherWindowsAreSelected) {
			return
		}

		const newWindowProperties = windowProperties.map((wp) => {
			return {
				...wp,
				selected: false
			}
		})

		const existingWindowIndex = newWindowProperties.findIndex(
			(wp) => wp.id === windowId
		)
		if (existingWindowIndex !== -1) {
			newWindowProperties[existingWindowIndex].selected = true
			setWindowProperties(newWindowProperties)
		}
	}

	const removeWindow = (windowId: string) =>
		setWindowProperties((x) => [...x.filter((x) => x.id !== windowId)])

	return (
		<WindowsContext.Provider
			value={{
				windowProperties: windowProperties,
				addWindow: addWindow,
				removeWindow: removeWindow,
				onMinimizeAllButtonClicked: onMinimizeAllButtonClicked,
				onWindowStateChanged: onWindowStateChanged,
				onTaskbarItemClicked: onTaskbarItemClicked,
				onWindowSelected: onWindowSelected
			}}
		>
			{children}
		</WindowsContext.Provider>
	)
}

export default WindowsContextProvider
