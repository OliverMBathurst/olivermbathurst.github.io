import React, { memo, useEffect, useState } from 'react'
import moment from 'moment'
import './styles.scss'

const DateDisplay : React.FC = () => {
    const [date, setDate] = useState<string>()

    useEffect(() => {
        var timeout = setInterval(() => {
            var newDate: Date = new Date()
            var amOrPm = newDate.getHours() >= 12 ? 'PM' : 'AM'
            var formatted = `${moment(newDate).format('HH:mm:ss')} ${amOrPm}`
            setDate(formatted) 
        }, 1000)
        return () => clearInterval(timeout)
    }, [])

    return (
        <div className="date-display">
            <span>{date}</span>
        </div>)
}

export default memo(DateDisplay)