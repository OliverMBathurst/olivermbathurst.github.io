import React from 'react'
import './styles.scss'
import CloseIcon from '../../../assets/icons/closeIcon'
import { URLS } from '../../../global/constants'

interface IOverlayProps {
    onClick: () => void
}

const Overlay = (props: IOverlayProps) => {
    const { onClick } = props
    const { gitHub, linkedIn, cv } = URLS

    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, url: string) => {
        if (event.button === 0) {
            window.location.href = url
        } else if (event.button === 1) {
            window.open(url, '_blank')
        }
    }

    return (
        <div className="overlay">
            <div onClick={onClick}>
                <CloseIcon />
            </div>
            <div className="central-div">
                <span className="heading">Oliver Bathurst</span>
                <span className="sub-heading">Full Stack Developer</span>
                <div className="overlay-button-container">
                    <button className="overlay-link" onMouseDown={(e) => onClickHandler(e, gitHub)}>GitHub</button>
                    <button className="overlay-link" onMouseDown={(e) => onClickHandler(e, linkedIn)}>LinkedIn</button>
                    <button className="overlay-link" onMouseDown={(e) => onClickHandler(e, cv)}>CV</button>
                </div>
            </div>
        </div>)
}

export default Overlay