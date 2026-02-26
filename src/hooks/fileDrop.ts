import { useEffect } from "react"

const FILE_TYPE = "file"

const useFileDrop = <T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	callback: (result: File | File[]) => void,
	mimeType: string,
	props?: React.InputHTMLAttributes<HTMLInputElement>
) => {
	const onDrop = (e: DragEvent) => {
		e.preventDefault()
		if (e.dataTransfer) {
			const files = [...e.dataTransfer.items]
				.map((item) => item.getAsFile())
				.filter((file) => file)

			if (props && props.multiple) {
				const filesArray: File[] = []
				for (const file of files) {
					if (file) {
						filesArray.push(file)
					}
				}

				callback(filesArray)
			} else if (files.length > 0) {
				const file = files[0]
				if (file && file.type.startsWith(mimeType)) {
					callback(file)
				}
			}
		}
	}

	const onDragOver = (e: DragEvent) => {
		if (e.dataTransfer) {
			const fileItems = [...e.dataTransfer.items].filter(
				(item) => item.kind === FILE_TYPE,
			)

			if (fileItems.length > 0) {
				e.preventDefault()
				if (fileItems.some((item) => item.type.startsWith(mimeType))) {
					e.dataTransfer.dropEffect = "move"
				} else {
					e.dataTransfer.dropEffect = "none"
				}
			}
		}
	}

	const onWindowDrop = (e: DragEvent) => {
		if (e.dataTransfer) {
			if ([...e.dataTransfer.items].some((item) => item.kind === FILE_TYPE)) {
				e.preventDefault()
			}
		}
	}

	const onWindowDragOver = (e: DragEvent) => {
		if (e.dataTransfer) {
			const fileItems = [...e.dataTransfer.items].filter(
				(item) => item.kind === FILE_TYPE,
			)

			if (fileItems.length > 0) {
				e.preventDefault()
				if (ref.current && !ref.current.contains(e.target as Node)) {
					e.dataTransfer.dropEffect = "none"
				}
			}
		}

	}

	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener("drop", onDrop)
			ref.current.addEventListener("dragover", onDragOver)
		}

		window.addEventListener("drop", onWindowDrop)
		window.addEventListener("dragover", onWindowDragOver)

		return () => {
			if (ref.current) {
				ref.current.removeEventListener("drop", onDrop)
				ref.current.removeEventListener("dragover", onDragOver)
			}

			window.removeEventListener("drop", onWindowDrop)
			window.removeEventListener("dragover", onWindowDragOver)
		}
	}, [onDrop, onWindowDrop, onWindowDragOver, onDragOver])
}

export default useFileDrop