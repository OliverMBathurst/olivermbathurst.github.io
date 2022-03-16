export enum WindowState {
    Minimized,
    Maximized,
    Normal,
    Closed
}

export enum WindowType {
    File,
    Directory,
    Settings
}

export enum WindowHandlerType {
    Click,
    Expand,
    Drag
}

export enum WindowExpandDirection {
    Top = 1 << 0,
    Bottom = 1 << 1,
    Left = 1 << 2,
    Right = 1 << 3,
    TopLeft = 1 << 4,
    TopRight = 1 << 5,
    BottomLeft = 1 << 6,
    BottomRight = 1 << 7
}