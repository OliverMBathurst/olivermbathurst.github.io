export enum SpecialBranch {
	None,
	Desktop,
	StartMenu,
	Taskbar
}

export enum ExpandDirection {
	None = 1 << 0,
	Top = 1 << 1,
	Bottom = 1 << 2,
	Left = 1 << 3,
	Right = 1 << 4,
	TopLeft = 1 << 5,
	TopRight = 1 << 6,
	BottomLeft = 1 << 7,
	BottomRight = 1 << 8
}

export enum Wallpaper {
	None,
	Colours,
	Slideshow,
	Conway
}

export enum FileSystemFilterType {
	All = "All",
	Apps = "Apps",
	Documents = "Documents",
	Folders = "Folders"
}

export enum NavigationType {
	Forwards,
	Backwards,
	Upwards
}