import React from "react"
import cancel from "../icons/cancel.png"
import close from "../icons/close.png"
import collapse from "../icons/collapse.png"
import drive from "../icons/drive.png"
import executable from "../icons/executable.png"
import expand from "../icons/expand.png"
import file from "../icons/file.png"
import folder from "../icons/folder.png"
import game from "../icons/game.png"
import internet from "../icons/internet.png"
import leftArrow from "../icons/left-arrow.png"
import maximise from "../icons/maximise.png"
import minimise from "../icons/minimise.png"
import pdf from "../icons/pdf.png"
import power from "../icons/power.png"
import rightArrow from "../icons/right-arrow.png"
import search from "../icons/search.png"
import start from "../icons/startMenu.png"
import textFile from "../icons/textFile.png"
import thumbs from "../icons/thumbs.png"
import upArrow from "../icons/up-arrow.png"

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

const CustomIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img alt="Custom icon by icon8" {...props} />
)

const ThumbsIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img src={thumbs} alt="Custom icon by icon8" {...props} />
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

export {
    CancelIcon,
    CloseIcon,
    CollapseIcon,
    CustomIcon,
    DriveIcon,
    ExecutableFileIcon,
    ExpandIcon,
    FolderIcon, GameIcon, GenericFileIcon,
    InternetIcon,
    LeftArrowIcon,
    MaximizeIcon,
    MinimizeIcon,
    PdfIcon,
    PowerIcon,
    RightArrowIcon,
    SearchIcon,
    StartMenuIcon,
    TextFileIcon,
    ThumbsIcon,
    UpArrowIcon
}
