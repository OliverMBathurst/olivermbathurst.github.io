import React, { createContext, useState } from "react"
import {
    IAddWindowProperties,
    IWindowProperties,
    WindowState
} from "../interfaces/windows"
import { Context } from "../types/fs"

interface IWindowsContext {
	windowProperties: IWindowProperties[]
	lastDeselectedWindowId: string | null,
	noWindowsSelected: boolean,
	addWindow: (window: IAddWindowProperties) => void
	removeWindow: (windowId: string) => void
	onMinimizeAllButtonClicked: () => void
	onWindowStateChanged: (windowId: string, newState: WindowState) => void
	onTaskbarItemClicked: (windowId: string) => void
	onWindowSelected: (windowId: string, selected: boolean) => void
	setWindowContext: (windowId: string, context: Context) => void
}

export const WindowsContext: React.Context<IWindowsContext> =
	createContext<IWindowsContext>({
		windowProperties: [],
		lastDeselectedWindowId: null,
		noWindowsSelected: true,
		addWindow: (_: IAddWindowProperties) => Function.prototype,
		removeWindow: (_: string) => Function.prototype,
		onMinimizeAllButtonClicked: () => Function.prototype,
		onWindowStateChanged: (_: string, __: WindowState) => Function.prototype,
		onTaskbarItemClicked: (_: string) => Function.prototype,
		onWindowSelected: (_: string, __: boolean) => Function.prototype,
		setWindowContext: (_: string, __: Context) => Function.prototype
	})

interface IWindowsContextProviderProps {
	children: React.ReactNode
}

const WindowsContextProvider = (props: IWindowsContextProviderProps) => {
	const { children } = props
	const [windowProperties, setWindowProperties] = useState<IWindowProperties[]>(
		[]
	)
	const [lastDeselectedWindowId, setLastDeselectedWindowId] = useState<string | null>(null)

	const addWindow = (properties: IAddWindowProperties) => {
		const { context, size, selected } = properties

		const defaultWindowSize = window.innerHeight / 2

		const windowSize = size ?? {
			width: defaultWindowSize,
			height: defaultWindowSize
		}

		const _selected = selected ?? true

		const newWindowProperties: IWindowProperties = {
			id: `${Date.now()}-${context.name}`,
			context: context,
			selected: _selected,
			size: windowSize,
			state: WindowState.Normal,
			previousState: null
		}

		setWindowProperties(wp => {
			const _windowProperties = [...wp]

			let _lastDeselectedWindowId: string | null = null
			for (let i = 0; i < _windowProperties.length; i++) {
				_windowProperties[i].selected = false
				_lastDeselectedWindowId = _windowProperties[i].id
			}

			if (!_selected) {
				_lastDeselectedWindowId = newWindowProperties.id
			}

			setLastDeselectedWindowId(_lastDeselectedWindowId)
			return [newWindowProperties, ..._windowProperties]
		})
	}

	const onMinimizeAllButtonClicked = () => {
		setWindowProperties(wp => {
			const _windowProperties = [...wp]

			for (let i = 0; i < _windowProperties.length; i++) {
				_windowProperties[i].selected = false
				_windowProperties[i].previousState = _windowProperties[i].state
				_windowProperties[i].state = WindowState.Minimised
			}

			setLastDeselectedWindowId(_windowProperties[_windowProperties.length - 1].id)

			return _windowProperties
		})
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

	const onWindowSelected = (windowId: string, selected: boolean) => {
		setWindowProperties((wp) => {
			const _windowProperties = [...wp]

			const existingWindowIdx = _windowProperties.findIndex(
				(wp) => wp.id === windowId
			)

			if (existingWindowIdx === -1) {
				return _windowProperties
			}

			if (!selected) {
				setLastDeselectedWindowId(_windowProperties[existingWindowIdx].id)
				_windowProperties[existingWindowIdx].selected = false
				return _windowProperties
			}

			const otherWindowsAreSelected = _windowProperties
				.filter((wp) => wp.id !== windowId)
				.find((wp) => wp.selected)

			if (
				_windowProperties[existingWindowIdx].selected &&
				!otherWindowsAreSelected
			) {
				return _windowProperties
			}

			let _lastDeselectedWindowId: string | null = null
			for (let i = 0; i < _windowProperties.length; i++) {
				if (i === existingWindowIdx) {
					_windowProperties[i].selected = true
					continue
				}

				_windowProperties[i].selected = false
				_lastDeselectedWindowId = _windowProperties[i].id
			}

			setLastDeselectedWindowId(_lastDeselectedWindowId)
			return _windowProperties
		})
	}

	const removeWindow = (windowId: string) => {
		if (lastDeselectedWindowId === windowId) {
			setLastDeselectedWindowId(null)
		}

		setWindowProperties((x) => [...x.filter((x) => x.id !== windowId)])
	}
		

	const setWindowContext = (windowId: string, context: Context) => {
		setWindowProperties((wp) => {
			const _windowProperties = [...wp]
			const existingWindowIdx = _windowProperties.findIndex(
				(x) => x.id === windowId
			)
			if (existingWindowIdx !== -1) {
				_windowProperties[existingWindowIdx].context = context
			}

			return _windowProperties
		})
	}

	return (
		<WindowsContext.Provider
			value={{
				windowProperties: windowProperties,
				lastDeselectedWindowId: lastDeselectedWindowId,
				noWindowsSelected: windowProperties.every(x => !x.selected),
				addWindow: addWindow,
				removeWindow: removeWindow,
				onMinimizeAllButtonClicked: onMinimizeAllButtonClicked,
				onWindowStateChanged: onWindowStateChanged,
				onTaskbarItemClicked: onTaskbarItemClicked,
				onWindowSelected: onWindowSelected,
				setWindowContext: setWindowContext
			}}
		>
			{children}
		</WindowsContext.Provider>
	)
}

export default WindowsContextProvider
