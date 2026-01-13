import { useRef, useState } from "react"
import { NO_SELECT_CLASS } from "../../constants"
import { CancelIcon, SearchIcon } from "../../icons"
import "./searchBar.scss"

interface ISearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	onCancelClicked?: () => void
}

const SearchBar = (props: ISearchBarProps) => {
	const { onCancelClicked, value: initialValue } = props
	const [value, setValue] = useState<string | number | readonly string[]>(
		initialValue ?? ""
	)

	const inputRef = useRef<HTMLInputElement | null>(null)

	const onSearchBarClicked = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}

	const onKeyUpInternal = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (inputRef.current) {
			setValue(inputRef.current.value)
		}
	}

	const onCancelClickedInternal = () => {
		if (inputRef.current) {
			inputRef.current.value = ""
			setValue("")
		}

		if (onCancelClicked) {
			onCancelClicked()
		}
	}

	const newProps: ISearchBarProps = { ...props }

	delete newProps.onCancelClicked

	return (
		<div className="search-bar" onClick={onSearchBarClicked}>
			<SearchIcon
				className={`search-bar__search-icon ${NO_SELECT_CLASS}`}
				height={20}
				width={20}
			/>
			<input
				className="search-bar__input"
				ref={inputRef}
				onKeyUp={onKeyUpInternal}
				{...newProps}
			/>
			{value && (
				<CancelIcon
					className={`search-bar__cancel-icon ${NO_SELECT_CLASS}`}
					height={20}
					width={20}
					onClick={onCancelClickedInternal}
				/>
			)}
		</div>
	)
}

export default SearchBar
