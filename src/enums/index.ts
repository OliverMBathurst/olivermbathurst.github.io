export enum SpecialBranch {
	None,
	Desktop,
}

export enum WindowExpandDirection {
	None = 1 << 0,
	Top = 1 << 1,
	Bottom = 1 << 2,
	Left = 1 << 3,
	Right = 1 << 4,
	TopLeft = 1 << 5,
	TopRight = 1 << 6,
	BottomLeft = 1 << 7,
	BottomRight = 1 << 8,
}
