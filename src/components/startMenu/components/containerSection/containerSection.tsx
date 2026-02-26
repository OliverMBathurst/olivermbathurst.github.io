import { CLASSNAMES } from "../../../../constants"
import { getIcon } from "../../../../helpers/icons"
import { getDisplayName } from "../../../../helpers/naming"
import { Context } from "../../../../types/fs"
import "./containerSection.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IContainerSectionProps<T> {
	title?: string
	items: T[]
	selected: string[]
	onItemClicked: (item: T, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	onItemDoubleClicked: (item: T, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const ContainerSection = <T extends Context>(
	props: IContainerSectionProps<T>
) => {
	const { title, items, selected, onItemClicked, onItemDoubleClicked } = props

	return (
		<div className="start-menu__bottom-container__container">
			{title && (
				<span className="start-menu__bottom-container__container__title">
					{title}
				</span>
			)}
			<div className="start-menu__bottom-container__container__items">
				{items.map((i) => {
					const contextKey = i.toContextUniqueKey()
					const Icon = getIcon(i, { className: "start-menu__bottom-container__container__items__item__icon" })
					const DisplayName = getDisplayName(i, false)
					const _selected = selected.indexOf(contextKey) !== -1

					return (
						<div
							key={contextKey}
							onClick={(e) => onItemClicked(i, e)}
							onDoubleClick={(e) => onItemDoubleClicked(i, e)}
							className={`start-menu__bottom-container__container__items__item${_selected ? "--selected" : ""} ${NO_SELECT_CLASS}`}
						>
							{Icon}
							<span className="start-menu__bottom-container__container__items__item__text">
								{DisplayName}
							</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ContainerSection
