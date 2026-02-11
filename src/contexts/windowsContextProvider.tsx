import React, { createContext, useEffect, useState } from "react"
import { DEFAULT_DOCUMENT_TITLE, FILETYPE_CUSTOM_ICON } from "../constants"
import { changeFavicon } from "../helpers/icons"
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
	const [lastDeselectedWindowId, setLastDeselectedWindowId] = useState<
		string | null
	>(null)

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
		setWindowProperties((wp) => {
			const { context, size, selected, handlerId } = properties

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
				handlerId
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
				noWindowsSelected: windowProperties.every((x) => !x.selected),
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
