import { useEffect, useMemo, useState } from "react"
import { GAME_DETERMINER } from "../../constants"
import { IGameFile } from "../../interfaces/fs"
import { IBaseGameProps } from "../../interfaces/game"

const Game = <T extends IBaseGameProps>(props: T) => {
    const { windowId, context } = props
    const [game, setGame] = useState<IGameFile | null>(null)

    useEffect(() => {
        if (GAME_DETERMINER in context) {
            setGame(context)
        }
    }, [GAME_DETERMINER, context, setGame])

    const Content = useMemo(() => {
        if (!game) {
            return null
        }

        return game.render(windowId, context)
    }, [game])

    return Content
}

export default Game