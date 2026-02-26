import { useEffect, useMemo, useState } from "react"
import { GAME_DETERMINER, CLASSNAMES } from "../../constants"
import { IGameFile } from "../../interfaces/fs"
import { IBaseGameProps } from "../../interfaces/game"
import "./game.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

const Game = <T extends IBaseGameProps>(props: T) => {
    const { windowId, context } = props
    const [game, setGame] = useState<IGameFile | null>(null)

    useEffect(() => {
        if (GAME_DETERMINER in context) {
            setGame(context)
        }
    }, [context, setGame])

    const Content = useMemo(() => {
        if (!game) {
            return null
        }

        return game.render(windowId, context)
    }, [game])

    if (!game) {
        return (
            <div className="game">
                <span className={`game__no-data ${NO_SELECT_CLASS}`}>
                    No game selected.
                </span>
            </div>
        )
    }

    return Content
}

export default Game