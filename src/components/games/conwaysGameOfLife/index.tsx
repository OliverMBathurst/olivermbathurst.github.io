import { useEffect, useRef, useState } from "react"
import { CLASSNAMES } from "../../../constants/"
import { IBaseGameProps } from "../../../interfaces/game"
import { Button } from "../../button"
import Input from "../../input"
import "./conwaysGameOfLife.scss"

const { NO_SELECT_CLASS } = CLASSNAMES

const DEFAULT_GRID_CELL_WIDTH = 30
const DEFAULT_GRID_CELL_HEIGHT = 30
const DEFAULT_GRID_WIDTH = 70
const DEFAULT_GRID_HEIGHT = 70
const DEFAULT_LIFE_CHANCE = 0.5
const DEFAULT_FPS = 1
const DPR = window.devicePixelRatio || 1

const ConwaysGameOfLife = (props: IBaseGameProps) => {
    const { windowId, context } = props
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fpsRef = useRef<HTMLInputElement | null>(null)
    const lifeChanceRef = useRef<HTMLInputElement | null>(null)
    const lifeRef = useRef<Map<string, boolean> | null>(null)
    const timeout = useRef<number | undefined>(undefined)
    const resizeTimeout = useRef<number | undefined>(undefined)
    const isResizing = useRef<boolean>(false)
    const isMouseDown = useRef<boolean>(false)

    const [isPaused, setIsPaused] = useState<boolean>(true)
    const [cellWidthPx, setCellWidthPx] = useState<number>(DEFAULT_GRID_CELL_WIDTH)
    const [cellHeightPx, setCellHeightPx] = useState<number>(DEFAULT_GRID_CELL_HEIGHT)
    const [generation, setGeneration] = useState<number>(0)
    const [FPS, setFPS] = useState<number>(DEFAULT_FPS)
    const [lifeChance, setLifeChance] = useState<number>(DEFAULT_LIFE_CHANCE)

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }

        const context = canvasRef.current.getContext("2d")
        if (!context) {
            return
        }

        const rect = canvasRef.current.getBoundingClientRect()
        canvasRef.current.width = rect.width * DPR
        canvasRef.current.height = rect.height * DPR
        context.scale(DPR, DPR)
    }, [DPR])

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }

        const context = canvasRef.current.getContext("2d")
        if (!context) {
            return
        }

        context.fillStyle = "white"
        context.fillRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height)
    }, [])

    const onCanvasResized = () => {
        if (!canvasRef.current) {
            return
        }

        const context = canvasRef.current.getContext("2d")
        if (!context) {
            return
        }

        const cellWidthPx = Math.ceil(canvasRef.current.width / DEFAULT_GRID_CELL_WIDTH)
        const cellHeightPx = Math.ceil(canvasRef.current.height / DEFAULT_GRID_CELL_HEIGHT)

        setCellWidthPx(cellWidthPx)
        setCellHeightPx(cellHeightPx)

        return {
            width: cellWidthPx,
            height: cellHeightPx
        }
    }

    const handleResize = () => {
        isResizing.current = true

        clearTimeout(resizeTimeout.current)

        resizeTimeout.current = setTimeout(() => {
            onCanvasResized()
            isResizing.current = false
        }, 1000)
    }

    const handleMouseUp = () => {
        isMouseDown.current = false
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [handleResize])

    const drawLife = () => {
        if (!canvasRef.current || !lifeRef.current) {
            return
        }

        const context = canvasRef.current.getContext("2d")
        if (!context) {
            return
        }

        const life = lifeRef.current
        for (const iteration of life.entries()) {
            const [coordinates, isAlive] = iteration
            const splitKey = coordinates.split("-")
            const [x, y] = [parseInt(splitKey[0]), parseInt(splitKey[1])]

            let alive = isAlive

            if (!isPaused) {
                const liveNeighbours = [
                    { x: x + 1, y },
                    { x: x - 1, y },
                    { x: x + 1, y: y + 1 },
                    { x: x - 1, y: y - 1 },
                    { x: x, y: y + 1 },
                    { x: x, y: y - 1 },
                    { x: x + 1, y: y - 1 },
                    { x: x - 1, y: y + 1 }
                ]
                    .filter(neighbour => neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x <= DEFAULT_GRID_WIDTH && neighbour.y <= DEFAULT_GRID_HEIGHT)
                    .map(neighbour => life.get(`${neighbour.x}-${neighbour.y}`))
                    .filter(x => x !== undefined && x)

                if (!alive && liveNeighbours.length === 3) {
                    alive = true
                    life.set(coordinates, true)
                } else if (alive && (liveNeighbours.length < 2 || liveNeighbours.length > 3)) {
                    alive = false
                    life.set(coordinates, false)
                }
            }

            drawCell(context, alive, x * cellWidthPx, y * cellHeightPx, cellWidthPx, cellHeightPx)
        }

        lifeRef.current = life

        if (!isPaused) {
            setGeneration(i => i + 1)
        }
    }

    const drawCell = (
        context: CanvasRenderingContext2D,
        alive: boolean,
        x: number,
        y: number,
        w: number,
        h: number) => {

        if (!alive) {
            context.clearRect(x, y, w, h)
        } else {
            context.fillStyle = "black"
            context.fillRect(x, y, w, h)
        }
    }

    useEffect(() => {
        timeout.current = setInterval(() => {
            requestAnimationFrame(drawLife)
        }, 1000 / FPS)

        return () => {
            clearInterval(timeout.current)
        }
    }, [requestAnimationFrame, drawLife, FPS])

    const onClearClicked = () => {
        if (!isPaused) {
            return
        }

        setGeneration(0)

        lifeRef.current = new Map<string, boolean>()

        if (!canvasRef.current) {
            return
        }

        const context = canvasRef.current.getContext("2d")
        if (!context) {
            return
        }

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height)
    }

    const onPlayButtonClicked = () => {
        if (!isPaused) {
            setIsPaused(true)
            return
        }
        let newLifeChance = DEFAULT_LIFE_CHANCE
        let newFPS = DEFAULT_FPS

        const fps = fpsRef.current?.value ?? `${DEFAULT_FPS}`
        const lifeChance = lifeChanceRef.current?.value ?? `${DEFAULT_LIFE_CHANCE}`

        const parsedFPS = parseInt(fps)
        if (!isNaN(parsedFPS) && parsedFPS > 0) {
            newFPS = parsedFPS
        }

        const parsedLifeChance = parseFloat(lifeChance)
        if (!isNaN(parsedLifeChance) && parsedLifeChance >= 0.0 && parsedLifeChance <= 1.0) {
            newLifeChance = parsedLifeChance
        }

        if (fpsRef.current) {
            fpsRef.current.value = fps
        }

        if (lifeChanceRef.current) {
            lifeChanceRef.current.value = lifeChance
        }

        setFPS(newFPS)
        setLifeChance(newLifeChance)
        setIsPaused(false)
    }

    const getMousePositionInCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!canvasRef.current) {
            return { x: 0, y: 0 }
        }

        const rect = canvasRef.current.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        return {
            x,
            y
        }
    }

    const onCanvasMouseDown = (_: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        isMouseDown.current = true
    }

    const onCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!isMouseDown.current) {
            return
        }
        onCanvasClick(e)
    }

    const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { x, y } = getMousePositionInCanvas(e)

        const cellX = Math.ceil(x / cellWidthPx)
        const cellY = Math.ceil(y / cellHeightPx)
        const key = `${cellX}-${cellY}`

        let life = lifeRef.current
        if (!life) {
            life = new Map<string, boolean>()
        }

        const entry = life.get(key)

        if (entry !== true) {
            life.set(key, true)
            lifeRef.current = life

            if (!canvasRef.current) {
                return
            }

            const context = canvasRef.current.getContext("2d")
            if (!context) {
                return
            }

            drawCell(context, true, cellX * cellWidthPx, cellY * cellHeightPx, cellWidthPx, cellHeightPx)
        }
    }

    return (
        <div
            key={`${windowId}-${context.name}`}
            className="conways-game-of-life"
        >
            <div className="conways-game-of-life__controls">
                <div className="conways-game-of-life__controls__control">
                    <span className={NO_SELECT_CLASS}>
                        FPS:
                    </span>
                    <Input
                        forwardRef={fpsRef}
                        defaultValue={FPS}
                    />
                </div>
                <div className="conways-game-of-life__controls__control">
                    <span className={NO_SELECT_CLASS}>
                        Life Chance % (0-1):
                    </span>
                    <Input
                        forwardRef={lifeChanceRef}
                        defaultValue={lifeChance}
                    />
                </div>
                <div className="conways-game-of-life__controls__control">
                    <Button onClick={onPlayButtonClicked}>
                        {isPaused ? "Start" : "Pause"}
                    </Button>
                </div>
                <div className="conways-game-of-life__controls__control">
                    <Button onClick={onClearClicked} disabled={!isPaused}>
                        Clear
                    </Button>
                </div>
            </div>
            <div className="conways-game-of-life__render-area">
                <canvas
                    ref={canvasRef}
                    className="conways-game-of-life__render-area__canvas"
                    onMouseDown={onCanvasMouseDown}
                    onMouseMove={onCanvasMouseMove}
                    onClick={onCanvasClick}
                />
                <div className="conways-game-of-life__render-area__info">
                    <span className="conways-game-of-life__render-area__info__generations">
                        Generation: {generation}
                    </span>
                </div>
            </div>
        </div>)
}

export default ConwaysGameOfLife