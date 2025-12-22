import { useEffect, useState } from "react"

export const useVisibility = (initialVisibility: boolean) => {
    const [visible, setVisible] = useState<boolean>(initialVisibility)

    const onVisibilityChange = () => {
        setVisible(!document.hidden)
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', onVisibilityChange, false)

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [])

    return visible
} 