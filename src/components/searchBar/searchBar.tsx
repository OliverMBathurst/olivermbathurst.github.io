import { useRef } from "react"
import { CLASSNAMES } from "../../constants"
import { CancelIcon, SearchIcon } from "../../icons"
import "./searchBar.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface ISearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	forwardRef?: React.RefObject<HTMLDivElement | null>
	elementCallback?: (elem: HTMLInputElement) => void
	onCancelClicked?: () => void
	setValue?: (value: string) => void
}

const SearchBar = (props: ISearchBarProps) => {
	const {
		elementCallback,
		onCancelClicked,
		value,
		forwardRef,
		setValue
	} = props

	const inputRef = useRef<HTMLInputElement | null>(null)

	const onSearchBarClicked = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	const onKeyUpInternal = (_: React.KeyboardEvent<HTMLInputElement>) => {
		if (inputRef.current && setValue) {
			setValue(inputRef.current.value)
		}
	}

	const onCancelClickedInternal = () => {
		if (inputRef.current) {
			inputRef.current.value = ""
			if (setValue) {
				setValue("")
			}
		}

		if (onCancelClicked) {
			onCancelClicked()
		}
	}

	const onMount = (elem: HTMLInputElement) => {
		inputRef.current = elem
		if (elementCallback) {
			elementCallback(elem)
		}
	}

	const newProps: ISearchBarProps = { ...props }
	delete newProps.onCancelClicked
	delete newProps.elementCallback
	delete newProps.forwardRef
	delete newProps.setValue

	return (
		<div className="search-bar" onClick={onSearchBarClicked} ref={forwardRef}>
			<SearchIcon className={`search-bar__search-icon ${NO_SELECT_CLASS}`} />
			<input
				className="search-bar__input"
				ref={onMount}
				onKeyUp={onKeyUpInternal}
				{...newProps}
			/>
			{value && (
				<CancelIcon
					className={`search-bar__cancel-icon ${NO_SELECT_CLASS}`}
					onClick={onCancelClickedInternal}
				/>
			)}
		</div>
	)
}

export default SearchBar
