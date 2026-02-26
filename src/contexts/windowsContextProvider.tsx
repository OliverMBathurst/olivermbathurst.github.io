import React, { createContext, useContext, useEffect, useState } from "react"
import { IContextProviderProps, RecentsContext } from "."
import { DEFAULT_DOCUMENT_TITLE } from "../constants"
import { changeFavicon } from "../helpers/icons"
import { getFullPath } from "../helpers/paths"
import {
    IAddWindowProperties,
    IWindowProperties,
    WindowState
} from "../interfaces/windows"
import { Context } from "../types/fs"

interface IWindowsContext {
	windowProperties: IWindowProperties[]
	lastDeselectedWindowId: string | null
	noWindowsSelected: boolean
	addWindow: (window: IAddWindowProperties) => void
	removeWindow: (windowId: string) => void
	maximiseWindow: (windowId: string) => void
	closeWindows: (windowIds: string[]) => void
	minimiseWindows: (windowIds: string[]) => void
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
		maximiseWindow: (_: string) => Function.prototype,
		closeWindows: (_: string[]) => Function.prototype,
		minimiseWindows: (_: string[]) => Function.prototype,
		onMinimizeAllButtonClicked: () => Function.prototype,
		onWindowStateChanged: (_: string, __: WindowState) => Function.prototype,
		onTaskbarItemClicked: (_: string) => Function.prototype,
		onWindowSelected: (_: string, __: boolean) => Function.prototype,
		setWindowContext: (_: string, __: Context) => Function.prototype
	})

const WindowsContextProvider = (props: IContextProviderProps) => {
	const { children } = props
	const [windowProperties, setWindowProperties] = useState<IWindowProperties[]>(
		[]
	)
	const [lastDeselectedWindowId, setLastDeselectedWindowId] = useState<
		string | null
	>(null)

	const { addRecentContext } = useContext(RecentsContext)

	useEffect(() => {
		const selectedWindowProperties = windowProperties.find((x) => x.selected)
		if (selectedWindowProperties) {
			document.title = selectedWindowProperties.context.fullName
			changeFavicon(selectedWindowProperties.context)
		} else {
			document.title = DEFAULT_DOCUMENT_TITLE
			changeFavicon(null)
		}
	}, [windowProperties, changeFavicon])

	const addWindow = (properties: IAddWindowProperties) => {
		const validatedFilePath = getFullPath(properties.context)
		if (!validatedFilePath) {
			return
		}

		addRecentContext(validatedFilePath)

		setWindowProperties((wp) => {
			const { context, size, selected, handlerId, arguments: _arguments } = properties

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
				previousState: null,
				handlerId,
				arguments: _arguments
			}

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
		if (windowProperties.length === 0) {
			return
		}

		setWindowProperties((wp) => {
			const _windowProperties = [...wp]
			for (let i = 0; i < _windowProperties.length; i++) {
				if (_windowProperties[i].state === WindowState.Minimised) {
					continue
				}

				_windowProperties[i] = {
					..._windowProperties[i],
					selected: false,
					previousState: _windowProperties[i].state,
					state: WindowState.Minimised
				}
			}

			setLastDeselectedWindowId(
				_windowProperties[_windowProperties.length - 1].id
			)
			return _windowProperties
		})
	}

	const onWindowStateChanged = (windowId: string, newState: WindowState) => {
		setWindowProperties((wp) => {
			const _windowProperties = [...wp]
			const targetWindowIndex = _windowProperties.findIndex(
				(x) => x.id === windowId
			)
			if (targetWindowIndex !== -1) {
				const existingWindow = _windowProperties[targetWindowIndex]

				const selected =
					newState === WindowState.Minimised
						? false
						: _windowProperties[targetWindowIndex].selected

				const newWindow = {
					...existingWindow,
					previousState: existingWindow.state,
					state: newState,
					selected: selected
				}

				_windowProperties[targetWindowIndex] = newWindow
				if (!selected) {
					setLastDeselectedWindowId(newWindow.id)
				}
			}

			return _windowProperties
		})
	}

	const onTaskbarItemClicked = (windowId: string) => {
		const newWindows = [...windowProperties]
		const targetWindowIndex = newWindows.findIndex((x) => x.id === windowId)
		if (targetWindowIndex !== -1) {
			const targetWindow = newWindows[targetWindowIndex]
			if (targetWindow.state === WindowState.Minimised) {
				targetWindow.state = targetWindow.previousState ?? WindowState.Normal
				targetWindow.previousState = WindowState.Minimised
				targetWindow.selected = true
			} else {
				if (targetWindow.selected) {
					targetWindow.previousState = targetWindow.state
					targetWindow.state = WindowState.Minimised
					targetWindow.selected = false
				} else {
					targetWindow.selected = true
				}
			}

			let _lastDeselectedWindowId: string | null = null
			if (targetWindow.selected) {
				for (let i = 0; i < newWindows.length; i++) {
					if (i !== targetWindowIndex) {
						newWindows[i].selected = false
						_lastDeselectedWindowId = newWindows[i].id
					}
				}
			} else {
				_lastDeselectedWindowId = targetWindow.id
			}

			setLastDeselectedWindowId(_lastDeselectedWindowId)
			newWindows[targetWindowIndex] = targetWindow
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

	const closeWindows = (windowIds: string[]) => {
		if (windowIds.length === 0) {
			return
		}

		setWindowProperties(wp => [...wp].filter(p => windowIds.indexOf(p.id) === -1))
	}

	const minimiseWindows = (windowIds: string[]) => {
		if (windowIds.length === 0) {
			return
		}

		setWindowProperties(wp => {
			return [...wp].map(p => {
				const isToBeMinimised = windowIds.indexOf(p.id) !== -1
				return {
					...p,
					previousState: isToBeMinimised ? p.state : p.previousState,
					state: isToBeMinimised ? WindowState.Minimised : p.state
				}
			})
		})
	}

	const maximiseWindow = (windowId: string) => {
		setWindowProperties(wp => {
			const newWindowProperties = [...wp]
			const index = newWindowProperties.findIndex(p => p.id === windowId)
			if (index !== -1) {
				const currentState = newWindowProperties[index].state
				if (currentState !== WindowState.Maximised) {
					newWindowProperties[index].state = WindowState.Maximised
					newWindowProperties[index].previousState = currentState
				}
			}

			return newWindowProperties
		})
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
				windowProperties,
				lastDeselectedWindowId,
				noWindowsSelected: windowProperties.every((x) => !x.selected),
				addWindow,
				removeWindow,
				maximiseWindow,
				closeWindows,
				minimiseWindows,
				onMinimizeAllButtonClicked,
				onWindowStateChanged,
				onTaskbarItemClicked,
				onWindowSelected,
				setWindowContext
			}}
		>
			{children}
		</WindowsContext.Provider>
	)
}

export default WindowsContextProvider
