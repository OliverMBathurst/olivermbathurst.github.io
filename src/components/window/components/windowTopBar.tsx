import React from 'react';
import { useDisplayName, useIcon } from '../../../hooks';
import { CloseIcon, MaximizeIcon, MinimizeIcon } from '../../../icons';
import { Node } from '../../../types/fs';
import './windowTopBar.scss';

interface IWindowTopBarProps {
    context: Node,
    onMaximiseButtonClicked: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
    onMinimiseButtonClicked: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
    onCloseButtonClicked: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
    onWindowTopBarMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onWindowTopBarDoubleClicked: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const imgProps = {
    onMouseDown: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => e.stopPropagation(),
    onMouseUp: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => e.stopPropagation(),
    onMouseMove: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => e.stopPropagation(),
}

const WindowTopBar = (props: IWindowTopBarProps) => {
    const {
        context,
        onWindowTopBarMouseDown,
        onMaximiseButtonClicked,
        onMinimiseButtonClicked,
        onCloseButtonClicked,
        onWindowTopBarDoubleClicked
    } = props

    const Icon = useIcon(context)
    const DisplayName = useDisplayName(context)
    
	return (
        <div
            className="window__top-bar"
            onMouseDown={onWindowTopBarMouseDown}
            onDoubleClick={onWindowTopBarDoubleClicked}
        >
            <div className="window__top-bar__icon no-select" onMouseDown={e => e.stopPropagation()}>
                {Icon}
            </div>
            <span className="window__top-bar__title no-select">
                {DisplayName}
            </span>
            <div className="window__top-bar__controls">
                <div className="window__top-bar__controls__button">
                    <MinimizeIcon className="no-select" onClick={onMinimiseButtonClicked} {...imgProps} />
                </div>
                <div className="window__top-bar__controls__button">
                    <MaximizeIcon className="no-select" onClick={onMaximiseButtonClicked} {...imgProps} />
                </div>
                <div className="window__top-bar__controls__close-button">
                    <CloseIcon className="no-select" onClick={onCloseButtonClicked} {...imgProps} />
                </div>
            </div>
        </div>)
}

export default WindowTopBar