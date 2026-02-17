import { useState } from "react"
import { NavigationType } from "../enums"

const useNavigationHistory = <T>(initialHistory?: T) => {
    const [history, setHistory] = useState<T[]>(() => {
        if (initialHistory) {
            return [initialHistory]
        }

        return []
    })
    const [historyPointer, setHistoryPointer] = useState<number>(0)

    const navigate = (navigationType: NavigationType) => {
        let newPointer = historyPointer

        if (navigationType === NavigationType.Forwards) {
            if (historyPointer < history.length - 1) {
                newPointer += 1
            }
        } else if (historyPointer > 0) {
            newPointer -= 1
        }

        setHistoryPointer(newPointer)

        return history[newPointer]
    }

    const addHistory = (historyItem: T) => {
        let historyCopy = [...history]
        const hasHistory = historyCopy.length > 0
        let newPointer = hasHistory ? historyPointer + 1 : 0

        if (!hasHistory) {
            historyCopy.push(historyItem)
        } else if (newPointer === historyCopy.length) {
            if (historyCopy[newPointer - 1] !== historyItem) {
                historyCopy.push(historyItem)
            } else {
                newPointer--;
            }
        } else if (historyCopy[newPointer] !== historyItem) {
            historyCopy[newPointer] = historyItem
            historyCopy = historyCopy.slice(0, newPointer + 1)
        }
        
        setHistoryPointer(newPointer)
        setHistory(historyCopy)
    }

    return {
        forwardsPossible: historyPointer < history.length - 1,
        backwardsPossible: historyPointer > 0,
        navigate,
        addHistory
    }
}

export default useNavigationHistory