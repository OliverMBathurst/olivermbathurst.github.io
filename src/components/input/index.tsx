import "./input.scss"

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    forwardRef?: React.RefObject<HTMLInputElement | null>
}

const Input = (props: IInputProps) => {
    const { forwardRef } = props

    const inputProps = { ...props }
    delete inputProps.forwardRef

    return (<input ref={forwardRef} className="input" {...inputProps} />)
}

export default Input