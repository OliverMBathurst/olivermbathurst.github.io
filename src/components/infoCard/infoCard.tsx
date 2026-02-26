import { useContext, useEffect, useState } from "react"
import { IInfoCardClickOption, IInfoCardContext, IInfoCardInformationRow, InfoCardClickAction, InfoCardType } from "."
import { APPLICATION_DETERMINER, BRANCHING_CONTEXT_DETERMINER, BRANCHING_CONTEXT_PARENT_PROPERTY, CLASSNAMES } from "../../constants"
import { RegistryContext, WindowsContext } from "../../contexts"
import { useDisplayName, useIcon } from "../../hooks"
import { IFileSystemResultTuple } from "../../interfaces/search"
import { ClipboardService, WindowPropertiesService } from "../../services"
import { Context } from "../../types/fs"
import { Button } from "../button"
import "./infoCard.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

interface IInfoCardProps {
    item: IFileSystemResultTuple
}

const windowPropertiesService = new WindowPropertiesService()
const clipboardService = new ClipboardService()

const InfoCard = (props: IInfoCardProps) => {
    const {
        item: {
            context,
            path
        }
    } = props

    const [infoCardContext, setInfoCardContext] = useState<IInfoCardContext | null>(null)
    const { addWindow } = useContext(WindowsContext)
    const registry = useContext(RegistryContext)

    const Icon = useIcon(context, true, undefined, true)
    const DisplayName = useDisplayName(context)

    useEffect(() => {
        let infoCardType: InfoCardType = InfoCardType.File
        if (APPLICATION_DETERMINER in context) {
            infoCardType = InfoCardType.App
        } else if (BRANCHING_CONTEXT_DETERMINER in context) {
            infoCardType = InfoCardType.Branch
        }

        const clickOptions: IInfoCardClickOption[] = [
            {
                title: "Open",
                action: InfoCardClickAction.Open
            },
            {
                title: "Copy path",
                action: InfoCardClickAction.CopyPath
            }
        ]

        clickOptions.push({
            title: `Open ${infoCardType === InfoCardType.Branch ? "folder" : "file"} location`,
            action: InfoCardClickAction.OpenFileLocation
        })

        const informationRows: IInfoCardInformationRow[] = []
        if (infoCardType !== InfoCardType.App) {
            informationRows.push({
                title: "Location",
                value: path
            })
        }

        setInfoCardContext({
            type: infoCardType,
            informationRows,
            clickOptions
        })
    }, [context])

    const onClickOptionClicked = (action: InfoCardClickAction) => {
        if (action === InfoCardClickAction.CopyPath) {
            clipboardService.setClipboard(path)
            return
        }

        if (action === InfoCardClickAction.Open) {
            const properties = windowPropertiesService.getProperties(context, registry)
            if (properties) {
                addWindow(properties)
            }
        } else if (action === InfoCardClickAction.OpenFileLocation) {
            if (!infoCardContext) {
                return
            }

            let openContext: Context | null = context
            if (!(BRANCHING_CONTEXT_PARENT_PROPERTY in openContext)) {
                return
            }

            openContext = openContext.parent

            if (!openContext) {
                return
            }

            const properties = windowPropertiesService.getProperties(openContext, registry)
            if (!properties) {
                return
            }

            properties.arguments = path
            addWindow(properties)
        }
    }

    return (
        <div className="info-card" onDoubleClick={() => onClickOptionClicked(InfoCardClickAction.Open)}>
            <div className="info-card__header">
                {Icon}
                <span className={`info-card__header__title ${NO_SELECT_CLASS}`}>{DisplayName}</span>
            </div>
            {infoCardContext && infoCardContext.informationRows.length > 0 && (
                <div className="info-card__information-rows">
                    {infoCardContext.informationRows.map(ir => {
                        const { title, value } = ir
                        return (
                            <div key={title} className="info-card__information-rows__row">
                                <span className={`info-card__information-rows__row__title ${NO_SELECT_CLASS}`}>
                                    {title}:
                                </span>
                                <span className={`info-card__information-rows__row__value ${NO_SELECT_CLASS}`}>
                                    {value}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
            {infoCardContext && infoCardContext.clickOptions.length > 0 && (
                <div className="info-card__click-options-rows">
                    {infoCardContext.clickOptions.map(co => {
                        const { title, action } = co
                        return (
                            <div
                                className="info-card__click-options-rows__row"
                                key={`info-card__click-options-rows__click-action-${title}`}
                                onClick={() => onClickOptionClicked(action)}
                            >
                                <Button className="info-card__click-options-rows__row__button">
                                    {title}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default InfoCard