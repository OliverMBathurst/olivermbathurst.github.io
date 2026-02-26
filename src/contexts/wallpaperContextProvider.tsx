import { createContext, useState } from "react"
import { Wallpaper } from "../enums"
import { IWallpaper } from "../interfaces/wallpaper"
import { IContextProviderProps } from "."

interface IWallpaperContext {
    wallpaper: IWallpaper
    setWallpaper: (wallpaper: IWallpaper) => void
}

export const WallpaperContext = createContext<IWallpaperContext>({
    wallpaper: {
        id: Wallpaper.Conway
    },
    setWallpaper: (_: IWallpaper) => Function.prototype
})

const WallpaperContextProvider = (props: IContextProviderProps) => {
    const { children } = props
    const [wallpaper, setWallpaper] = useState<IWallpaper>(
        { id: Wallpaper.Conway }
    )

    return (
        <WallpaperContext.Provider value={{
            wallpaper,
            setWallpaper
        }}>
            {children}
        </WallpaperContext.Provider>)
}

export default WallpaperContextProvider