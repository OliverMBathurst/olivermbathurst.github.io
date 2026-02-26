import { useEffect, useState } from "react"

const useVisibility = (initialVisibility: boolean) => {
	const [visible, setVisible] = useState<boolean>(initialVisibility)

	const onVisibilityChange = () => {
		setVisible(document.visibilityState !== "hidden")
	}

	useEffect(() => {
		document.addEventListener("visibilitychange", onVisibilityChange, false)

		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange)
		}
	}, [])

	return visible
}

export default useVisibility
