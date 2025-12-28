import React from 'react'
import file from '../icons/file.png'
import textFile from '../icons/textFile.png'
import executable from '../icons/executable.png'
import internet from '../icons/internet.png'
import pdf from '../icons/pdf.png'
import close from '../icons/close.png'
import minimise from '../icons/minimise.png'
import maximise from '../icons/maximise.png'

const GenericFileIcon = (props: IIconProps) => <img src={file} alt="File icon by icon8" {...props} />

const TextFileIcon = (props: IIconProps) => <img src={textFile} alt="Text file icon by icon8" {...props} />

const ExecutableFileIcon = (props: IIconProps) => <img src={executable} alt="Executable file icon by icon8" {...props} />

const InternetIcon = (props: IIconProps) => <img src={internet} alt="File icon by icon8" {...props} />

const PdfIcon = (props: IIconProps) => <img src={pdf} alt="PDF icon by icon8" {...props} />

const CloseIcon = (props: IIconProps) =>
(
    <img
        src={close}
        alt="Close icon by icon8"
        {...props}
    />
)

const MinimizeIcon = (props: IIconProps) =>
(
    <img
        src={minimise}
        alt="Minimise icon by icon8"
        {...props}
    />
)

const MaximizeIcon = (props: IIconProps) =>
(
    <img
        src={maximise}
        alt="Maximise icon by icon8"
        {...props}
    />
)

export {
    GenericFileIcon,
    CloseIcon,
    MinimizeIcon,
    MaximizeIcon,
    InternetIcon,
    PdfIcon,
    TextFileIcon,
    ExecutableFileIcon
}

export interface IIconProps {
    className?: string
    onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
    onMouseDown?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
    onMouseUp?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
    onMouseMove?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
}
