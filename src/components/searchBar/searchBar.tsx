import { useRef, useState } from "react"
import { CancelIcon, SearchIcon } from "../../icons"
import "./searchBar.scss"
import { NO_SELECT_CLASS } from "../../constants"

interface ISearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	onInputCancelled?: () => void
}

const SearchBar = (props: ISearchBarProps) => {
	const { onChange, onInputCancelled, value: initialValue } = props
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

	const onChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value)

		if (onChange) {
			onChange(e)
		}
	}

	const onCancelClickedInternal = () => {
		if (inputRef.current) {
			inputRef.current.value = ""
			setValue("")
		}

		if (onInputCancelled) {
			onInputCancelled()
		}
	}

	return (
		<div className="search-bar" onClick={onSearchBarClicked}>
			<SearchIcon className={`search-bar__search-icon ${NO_SELECT_CLASS}`} height={20} width={20} />
			<input
				className="search-bar__input"
				ref={inputRef}
				onChange={onChangeInternal}
				{...props}
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
