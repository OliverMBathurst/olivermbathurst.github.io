import { useState, useEffect } from 'react';

const useClick = <T extends HTMLElement>(
    onSingleClick: (e: React.MouseEvent<T, MouseEvent>) => void,
    onDoubleClick: (e: React.MouseEvent<T, MouseEvent>) => void,
    delay = 250) => {
    const [click, setClick] = useState<number>(0)
    const [event, setEvent] = useState<React.MouseEvent<T, MouseEvent>>()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (click === 1 && event) {
                onSingleClick(event)
            }
            setClick(0);
        }, delay);

        if (click === 2 && event) {
            onDoubleClick(event)
        }

        return () => clearTimeout(timer)

    }, [click])

    return (e: React.MouseEvent<T, MouseEvent>) => {
        setClick(prev => prev + 1)
        setEvent(e)
    }
}

export default useClick