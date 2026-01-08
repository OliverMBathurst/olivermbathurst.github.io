import { useEffect } from "react"

const useClickOutside = <T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	callback: (event: MouseEvent) => void
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				ref &&
				ref.current &&
				event.target &&
				!ref.current.contains(event.target as Node)
			) {
				callback(event)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [ref, callback])
}

export default useClickOutside
