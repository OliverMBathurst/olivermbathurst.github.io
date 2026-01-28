import "./fileSelector.scss"

interface IFileSelectorProps extends React.InputHTMLAttributes<HTMLInputElement> {
    forwardRef?: React.RefObject<HTMLInputElement | null>
}

const FileSelector = (props: IFileSelectorProps) => {
    const { forwardRef } = props

    const inputProps = { ...props }
    delete inputProps.forwardRef

    return (<input ref={forwardRef} className="file-selector" type="file" {...inputProps} />)
}

export default FileSelector