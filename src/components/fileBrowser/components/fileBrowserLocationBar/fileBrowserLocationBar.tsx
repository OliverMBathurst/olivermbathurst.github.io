import { useEffect, useRef, useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER } from "../../../../constants"
import { getFullPath } from "../../../../helpers/paths"
import { useClickOutside, useFileSystem, useIcon } from "../../../../hooks"
import { BranchingContext, Leaf, Shortcut } from "../../../../types/fs"
import "./fileBrowserLocationBar.scss"

interface IFileBrowserLocationBarProps {
	context: BranchingContext
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf | Shortcut) => void
}

const FileBrowserLocationBar = (props: IFileBrowserLocationBarProps) => {
	const { context, onDirectoryChanged, onFileNavigation } = props
	const [displayValue, setDisplayValue] = useState<string>(context.name)

	const { validateFilePath } = useFileSystem(context)

	const inputRef = useRef<HTMLInputElement | null>(null)

	const Icon = useIcon(context, true, {
		className: "file-browser-location-bar__icon",
		onClick: () => inputRef.current?.focus()
	})

	const fullPath = getFullPath(context)

	useEffect(() => {
		setDisplayValue(context.name)
	}, [context, setDisplayValue])

	useClickOutside(inputRef, () => setDisplayValue(context.name))

	const onInputChangedInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayValue(e.target.value)
	}

	const onInputFocusedInternal = (
		_: React.FocusEvent<HTMLInputElement, Element>
	) => {
		setDisplayValue(fullPath)
	}

	const onKeyPressInternal = (e: KeyboardEvent) => {
		if (e.key === "Enter" && inputRef.current) {
			const resolvedContext = validateFilePath(inputRef.current.value)
			if (resolvedContext) {
				if (BRANCHING_CONTEXT_DETERMINER in resolvedContext) {
					onDirectoryChanged(resolvedContext)
				} else {
					onFileNavigation(resolvedContext)
					setDisplayValue(context.name)
				}
			} else {
				setDisplayValue(fullPath)
			}
		}
	}

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.addEventListener("keypress", onKeyPressInternal)
		}

		return () => {
			if (inputRef.current) {
				inputRef.current.removeEventListener("keypress", onKeyPressInternal)
			}
		}
	}, [onKeyPressInternal])

	return (
		<div className="file-browser-location-bar">
			{Icon}
			<input
				type="text"
				className="file-browser-location-bar__input"
				ref={inputRef}
				value={displayValue}
				onFocus={onInputFocusedInternal}
				onChange={onInputChangedInternal}
			/>
		</div>
	)
}

export default FileBrowserLocationBar
