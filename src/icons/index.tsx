import React from "react"
import cancel from "./cancel.png"
import close from "./close.png"
import collapse from "./collapse.png"
import drive from "./drive.png"
import executable from "./executable.png"
import expand from "./expand.png"
import file from "./file.png"
import folder from "./folder.png"
import game from "./game.png"
import image from "./image.png"
import internet from "./internet.png"
import leftArrow from "./left-arrow.png"
import maximise from "./maximise.png"
import minimise from "./minimise.png"
import pdf from "./pdf.png"
import plus from "./plus.png"
import power from "./power.png"
import rightArrow from "./right-arrow.png"
import search from "./search.png"
import selected from "./selected.png"
import shortcut from "./shortcut.png"
import start from "./startMenu.png"
import textFile from "./textFile.png"
import thumbs from "./thumbs.png"
import upArrow from "./up-arrow.png"
import zoomIn from "./zoomIn.png"
import zoomOut from "./zoomOut.png"

const GenericFileIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={file} alt="File icon by icon8" {...props} />
)

const TextFileIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={textFile} alt="Text file icon by icon8" {...props} />
)

const ExecutableFileIcon = (
	props: React.ImgHTMLAttributes<HTMLImageElement>
) => <img src={executable} alt="Executable file icon by icon8" {...props} />

const InternetIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={internet} alt="File icon by icon8" {...props} />
)

const PdfIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={pdf} alt="PDF icon by icon8" {...props} />
)

const FolderIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={folder} alt="Folder icon by icon8" {...props} />
)

const DriveIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={drive} alt="Drive icon by icon8" {...props} />
)

const StartMenuIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={start} alt="Start menu icon by icon8" {...props} />
)

const CloseIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={close} alt="Close icon by icon8" {...props} />
)

const MinimizeIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={minimise} alt="Minimise icon by icon8" {...props} />
)

const MaximizeIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={maximise} alt="Maximise icon by icon8" {...props} />
)

const SearchIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={search} alt="Search icon by icon8" {...props} />
)

const CancelIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={cancel} alt="Cancel icon by icon8" {...props} />
)

const ExpandIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={expand} alt="Expand icon by icon8" {...props} />
)

const CollapseIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={collapse} alt="Collapse icon by icon8" {...props} />
)

const ThumbsIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={thumbs} alt="Thumbs icon by icon8" {...props} />
)

const UpArrowIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={upArrow} alt="Up arrow icon by icon8" {...props} />
)

const LeftArrowIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={leftArrow} alt="Left arrow icon by icon8" {...props} />
)

const RightArrowIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={rightArrow} alt="Right arrow icon by icon8" {...props} />
)

const PowerIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={power} alt="Power icon by icon8" {...props} />
)

const GameIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={game} alt="Game icon by icon8" {...props} />
)

const SelectedIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={selected} alt="Selected icon by icon8" {...props} />
)

const ShortcutIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={shortcut} alt="Shortcut icon by icon8" {...props} />
)

const ImageIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={image} alt="Image icon by icon8" {...props} />
)

const ZoomInIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={zoomIn} alt="Zoom icon by icon8" {...props} />
)

const ZoomOutIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={zoomOut} alt="Zoom icon by icon8" {...props} />
)

const PlusIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={plus} alt="Plus icon by icon8" {...props} />
)

const CustomIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img {...props} alt="Custom icon by icon8" />
)

export {
    CancelIcon,
    CloseIcon,
    CollapseIcon,
    CustomIcon,
    DriveIcon,
    ExecutableFileIcon,
    ExpandIcon,
    FolderIcon, GameIcon, GenericFileIcon, ImageIcon, InternetIcon,
    LeftArrowIcon,
    MaximizeIcon,
    MinimizeIcon,
    PdfIcon, PlusIcon, PowerIcon,
    RightArrowIcon,
    SearchIcon, SelectedIcon,
    ShortcutIcon, StartMenuIcon,
    TextFileIcon,
    ThumbsIcon,
    UpArrowIcon, ZoomInIcon,
    ZoomOutIcon
}
