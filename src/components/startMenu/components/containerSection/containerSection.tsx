import { CLASSNAMES } from "../../../../constants"
import { getIcon } from "../../../../helpers/icons"
import { getDisplayName } from "../../../../helpers/naming"
import { Context } from "../../../../types/fs"
import "./containerSection.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IContainerSectionProps<T> {
	title: string
	items: T[]
	onRecommendedItemClicked: (item: T) => void
}

const ContainerSection = <T extends Context>(
	props: IContainerSectionProps<T>
) => {
	const { title, items, onRecommendedItemClicked } = props

	return (
		<div className="start-menu__bottom-container__container">
			<span className="start-menu__bottom-container__container__title">
				{title}
			</span>
			<div className="start-menu__bottom-container__container__items">
				{items.map((i) => {
					const contextKey = i.toContextUniqueKey()
					const Icon = getIcon(i)
					const DisplayName = getDisplayName(i)

					return (
						<div
							key={contextKey}
							onClick={() => onRecommendedItemClicked(i)}
							className={`start-menu__bottom-container__container__items__item ${NO_SELECT_CLASS}`}
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
