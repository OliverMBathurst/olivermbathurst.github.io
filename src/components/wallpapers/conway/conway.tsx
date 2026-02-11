import { useEffect, useRef, useState } from "react"
import "./conway.scss"

const FPS = 1
const DPR = window.devicePixelRatio || 1
const CELL_LIFE_CHANCE = 0.5
const CELL_WIDTH = 30
const CELL_HEIGHT = 30

const CELL_DEAD_COLOUR = "#010065"
const CELL_ALIVE_COLOUR = "black"

const Conway = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: window.innerWidth, height: window.innerHeight })
    const lifeRef = useRef<Map<string, boolean> | null>(null)
    const cellsWide = useRef<number | null>(null)
    const cellsTall = useRef<number | null>(null)
    const timeout = useRef<number | undefined>(undefined)
    const resizeTimeout = useRef<number | undefined>(undefined)
    const isResizing = useRef<boolean>(false)

    useEffect(() => {
        const { width: innerWidth, height: innerHeight } = dimensions

        cellsTall.current = Math.ceil(innerHeight / CELL_HEIGHT)
        cellsWide.current = Math.ceil(innerWidth / CELL_WIDTH)

        const lifeCoords = new Map<string, boolean>()

        for (let x = 0; x < cellsWide.current; x++) {
            for (let y = 0; y < cellsTall.current; y++) {
                lifeCoords.set(`${x}-${y}`, Math.random() > CELL_LIFE_CHANCE)
            }
        }

        lifeRef.current = lifeCoords

        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d")
            if (context) {
                context.canvas.width = innerWidth
                context.canvas.height = innerHeight
            }
        }
    }, [dimensions])

    const handleResize = () => {
        isResizing.current = true

        clearTimeout(resizeTimeout.current)
        
        resizeTimeout.current = setTimeout(() => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
            isResizing.current = false
        }, 1000)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [handleResize])

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

    

    const drawLife = () => {
        if (!canvasRef.current
            || !lifeRef.current
            || isResizing.current
            || !cellsWide.current
            || !cellsTall.current
        ) {
            return
        }

        const cW = cellsWide.current
        const cT = cellsTall.current

        const context = canvasRef.current.getContext("2d")
        if (!context) {
            return
        }

        const life = lifeRef.current
        for (const iteration of life.entries()) {
            const [coordinates, isAlive] = iteration
            const splitKey = coordinates.split("-")
            const [x, y] = [parseInt(splitKey[0]), parseInt(splitKey[1])]

            const liveNeighbours = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x: x + 1, y: y + 1 },
                { x: x - 1, y: y - 1 },
                { x: x, y: y + 1},
                { x: x, y: y - 1 },
                { x: x + 1, y: y - 1 },
                { x: x - 1, y: y + 1 }
            ]
                .filter(neighbour => neighbour.x >= 0 && neighbour.y >= 0 && neighbour.x <= cW && neighbour.y <= cT)
                .map(neighbour => life.get(`${neighbour.x}-${neighbour.y}`))
                .filter(x => x !== undefined && x)

            let alive = isAlive
            if (!alive && liveNeighbours.length === 3) {
                alive = true
                life.set(coordinates, alive)
            } else if (alive && (liveNeighbours.length < 2 || liveNeighbours.length > 3)) {
                alive = false
                life.set(coordinates, alive)
            }

            const drawX = x * CELL_WIDTH
            const drawY = y * CELL_HEIGHT

            if (!alive) {
                context.fillStyle = CELL_DEAD_COLOUR
                context.fillRect(drawX, drawY, CELL_WIDTH, CELL_HEIGHT)
            } else {
                context.fillStyle = CELL_ALIVE_COLOUR
                context.fillRect(drawX, drawY, CELL_WIDTH, CELL_HEIGHT)
            }
        }

        lifeRef.current = life
    }

    useEffect(() => {
        requestAnimationFrame(drawLife)

        timeout.current = setInterval(() => {
            requestAnimationFrame(drawLife)
        }, 1000 / FPS)

        return () => {
            clearInterval(timeout.current)
        }
    }, [requestAnimationFrame, drawLife, FPS])

    return (
        <div className="conway__overlay">
            <canvas
                ref={canvasRef}
                className="conway"
            />
        </div>
    )
}

export default Conway