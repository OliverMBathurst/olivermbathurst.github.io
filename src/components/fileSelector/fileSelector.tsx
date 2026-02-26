import { useRef } from "react"
import { Button } from "../button"
import "./fileSelector.scss"

interface IFileSelectorProps extends React.InputHTMLAttributes<HTMLInputElement> {
	buttonText?: string
}

const FileSelector = (props: IFileSelectorProps) => {
	const { buttonText } = props

	const inputRef = useRef<HTMLInputElement | null>(null)

	const onButtonClicked = () => {
		if (inputRef.current) {
			inputRef.current.click()
		}
	}

	const inputProps = { ...props }
	delete inputProps.buttonText

	return (
		<>
			<Button onClick={onButtonClicked}>{buttonText ?? "Open"}</Button>
			<input
				ref={inputRef}
				className="file-selector"
				type="file"
				{...inputProps}
			/>
		</>
	)
}

export default FileSelector
