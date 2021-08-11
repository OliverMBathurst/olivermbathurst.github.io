import React, { memo, useEffect, useState } from 'react'
import './styles.scss'

const DateDisplay : React.FC = () => {
    const [date, setDate] = useState<string>()

    useEffect(() => {
        var timeout = setInterval(() => {
            var newDate: Date = new Date()
            newDate.setSeconds(newDate.getSeconds() + newDate.getTimezoneOffset())
            setDate(`${newDate.toLocaleTimeString()} ${newDate.getHours() >= 12 ? 'PM' : 'AM'}`)
        }, 1000)
        return () => clearInterval(timeout)
    }, [])

    return (
        <div className="date-display">
            <span>{date}</span>
        </div>)
}

export default memo(DateDisplay)