import React, { Context as ReactContext, createContext, useState } from "react"
import { Context } from "../types/fs"

interface IDesktopItemContext {
	selectedContextKeys: string[]
	onDesktopClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	addElementReference: <T extends HTMLElement>(element: T | null, context: Context) => void
	onDesktopItemClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, context: Context) => void
	onDesktopItemDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onDesktopDrop: (e: React.DragEvent<HTMLDivElement>) => void
	onDesktopDragOver: (e: React.DragEvent<HTMLDivElement>) => void
	onWindowResized: (e: UIEvent) => void
}

interface IDesktopItemContextProviderProps {
    children: React.ReactNode
}

export const DesktopItemContext: ReactContext<IDesktopItemContext> = createContext<IDesktopItemContext>({
	selectedContextKeys: [],
	onDesktopClicked: (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => Function.prototype,
	onDesktopItemClicked: (_: React.MouseEvent<HTMLDivElement, MouseEvent>, __: Context) => Function.prototype,
	addElementReference: <T extends HTMLElement>(_: T | null, __: Context) => Function.prototype,
	onDesktopItemDoubleClicked: (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => Function.prototype,
	onDesktopDrop: (_: React.DragEvent<HTMLDivElement>) => Function.prototype,
	onDesktopDragOver: (_: React.DragEvent<HTMLDivElement>) => Function.prototype,
	onWindowResized: (_: UIEvent) => Function.prototype
})

const elementReferences: Record<string, HTMLElement> = { }

const DesktopItemContextProvider = (props: IDesktopItemContextProviderProps) => {
    const { children } = props

	const [selectedContextKeys, setSelectedContextKeys] = useState<string[]>([])

	const onDesktopItemClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, context: Context) => {
		const targetContextKey = context.toContextUniqueKey()
		if (selectedContextKeys.length === 0) {
			setSelectedContextKeys([targetContextKey])
		} else {
			if (selectedContextKeys.length === 1
				&& selectedContextKeys[0] === targetContextKey
				&& !e.ctrlKey) {
				return
			}

			if (e.ctrlKey) {
				if (selectedContextKeys.indexOf(targetContextKey) !== -1) {
					setSelectedContextKeys(ck => [...ck.filter(k => k !== targetContextKey)])
				} else {
					setSelectedContextKeys(ck => [...ck, targetContextKey])
				}
			} else if (e.shiftKey) {
				if (selectedContextKeys.length === 1 && selectedContextKeys[0] === targetContextKey) {
					return
				}

				if (selectedContextKeys.length === 0) {
					setSelectedContextKeys([targetContextKey])
					return
				}

				const initialContextKey = selectedContextKeys[0]
				
				const initialSelection = elementReferences[initialContextKey]
				const initialRect = initialSelection.getBoundingClientRect()

				const targetSelection = elementReferences[targetContextKey]
				const targetRect = targetSelection.getBoundingClientRect()

				const newContextSelections: string[] = [initialContextKey, targetContextKey]
				const elementKeys = Object.keys(elementReferences)

				for (let i = 0; i < elementKeys.length; i++) {
					if (elementKeys[i] === targetContextKey || elementKeys[i] === initialContextKey) {
						continue
					}

					const elem = elementReferences[elementKeys[i]]
					const elemRect = elem.getBoundingClientRect()

					if (initialRect.top >= targetRect.top) {
						if (elemRect.top >= targetRect.top && elemRect.top <= initialRect.top) {
							newContextSelections.push(elementKeys[i])
						}
					} else {
						if (elemRect.top <= targetRect.top && elemRect.top >= initialRect.top) {
							newContextSelections.push(elementKeys[i])
						}
					}
				}

				setSelectedContextKeys(newContextSelections)
			} else {
				setSelectedContextKeys([targetContextKey])
			}
		}
	}

	const onDesktopItemDoubleClicked = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setSelectedContextKeys([])
	}

	const onDesktopClicked = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setSelectedContextKeys([])
	}

	const addElementReference = <T extends HTMLElement>(element: T | null, context: Context) => {
		if (element === null) {
			return
		}

		const contextKey = context.toContextUniqueKey()
		elementReferences[contextKey] = element
	}

	const onDesktopDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		const contextKey = e.dataTransfer.getData("text")
		const elem = elementReferences[contextKey]
		if (elem) {
			elem.style.position = "absolute"
			elem.style.left = `${e.clientX - (elem.clientWidth / 2)}px`
			elem.style.top = `${e.clientY - (elem.clientHeight / 2)}px`
		}
	}

	const onDesktopDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
	}

	const onDesktopResized = () => {
		const elementKeys = Object.keys(elementReferences)
		for (let i = 0; i < elementKeys.length; i++) {
			const elem = elementReferences[elementKeys[i]]
			if (elem.style.position === "absolute") {
				elem.style.position = "static"
			}
		}
	}

    return (
		<DesktopItemContext.Provider value={{
			selectedContextKeys: selectedContextKeys,
			onDesktopClicked: onDesktopClicked,
			addElementReference: addElementReference,
			onDesktopItemClicked: onDesktopItemClicked,
			onDesktopItemDoubleClicked: onDesktopItemDoubleClicked,
			onDesktopDrop: onDesktopDrop,
			onDesktopDragOver: onDesktopDragOver,
			onWindowResized: onDesktopResized
		}}>
            {children}
        </DesktopItemContext.Provider>)
}

export default DesktopItemContextProvider