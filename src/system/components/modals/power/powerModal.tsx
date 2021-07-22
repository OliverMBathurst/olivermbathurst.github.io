import React from 'react'
import './styles.scss'

interface IPowerModalProps {
    sleep: () => void
    shutdown: () => void
    restart: () => void
}

const PowerModal = (props: IPowerModalProps) => {
    const {
        sleep,
        shutdown,
        restart
    } = props

    return (
        <div className="power-modal">
            <div className="power-option" onClick={sleep}>
                <span className="power-option-text">Sleep</span>
            </div>
            <div className="power-option" onClick={shutdown}>
                <span className="power-option-text">Shutdown</span>
            </div>
            <div className="power-option" onClick={restart}>
                <span className="power-option-text">Restart</span>
            </div>
        </div>)
}

export default PowerModal