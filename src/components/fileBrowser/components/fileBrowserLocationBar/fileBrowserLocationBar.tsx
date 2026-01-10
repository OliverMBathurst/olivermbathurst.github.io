import { useEffect, useRef, useState } from "react"
import { BRANCHING_CONTEXT_DETERMINER } from "../../../../constants"
import { getFullPath } from "../../../../helpers/paths"
import { useClickOutside, useFileSystem } from "../../../../hooks"
import { BranchingContext, Leaf } from "../../../../types/fs"
import "./fileBrowserLocationBar.scss"

interface IFileBrowserLocationBarProps {
	context: BranchingContext
	onDirectoryChanged: (context: BranchingContext) => void
	onFileNavigation: (context: Leaf) => void
}

const FileBrowserLocationBar = (props: IFileBrowserLocationBarProps) => {
	const { context, onDirectoryChanged, onFileNavigation } = props
	const [displayValue, setDisplayValue] = useState<string>(context.name)

	const { validateFilePath } = useFileSystem(context)

	const inputRef = useRef<HTMLInputElement | null>(null)

	const fullPath = getFullPath(context)

	useClickOutside(inputRef, () => setDisplayValue(context.name))

	const onInputChangedInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayValue(e.target.value)
	}

	const onInputFocusedInternal = (_: React.FocusEvent<HTMLInputElement, Element>) => {
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
		<input
			type="text"
			className="file-browser-location-bar"
			ref={inputRef}
			value={displayValue}
			onFocus={onInputFocusedInternal}
			onChange={onInputChangedInternal}
		/>)
}

export default FileBrowserLocationBar