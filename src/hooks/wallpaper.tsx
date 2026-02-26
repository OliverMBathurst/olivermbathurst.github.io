import { useContext } from "react"
import { Colours, Conway, ImageSlideshow } from "../components/wallpapers"
import { WallpaperContext } from "../contexts"
import { Wallpaper } from "../enums"

const useWallpaper = () => {
    const { wallpaper } = useContext(WallpaperContext)

    switch (wallpaper.id) {
        case Wallpaper.Colours:
            return (<Colours />)
        case Wallpaper.Slideshow:
            return (<ImageSlideshow />)
        case Wallpaper.Conway:
            return (<Conway />)
        case Wallpaper.None:
        default:
            return null
    }
}

export default useWallpaper