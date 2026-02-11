import { useRef } from "react"
import { CLASSNAMES } from "../../constants"
import { CancelIcon, SearchIcon } from "../../icons"
import "./searchBar.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface ISearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	forwardRef?: React.RefObject<HTMLDivElement | null>
	elementCallback?: (elem: HTMLInputElement) => void
	onCancelClicked?: () => void
	onInputChange?: (text: string) => void
}

const SearchBar = (props: ISearchBarProps) => {
	const {
		elementCallback,
		onCancelClicked,
		value,
		forwardRef,
		onInputChange,
		onChange
	} = props

	const inputRef = useRef<HTMLInputElement | null>(null)

	const onSearchBarClicked = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	const onChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value

		if (onInputChange) {
			onInputChange(val)
		}

		if (onChange) {
			onChange(e)
		}
	}

	const onCancelClickedInternal = () => {
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
	delete newProps.onInputChange

	return (
		<div className="search-bar" onClick={onSearchBarClicked} ref={forwardRef}>
			<SearchIcon className={`search-bar__search-icon ${NO_SELECT_CLASS}`} />
			<input
				className="search-bar__input"
				ref={onMount}
				onChange={onChangeInternal}
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
