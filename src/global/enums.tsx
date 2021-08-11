export enum WindowState {
    Minimized,
    Maximized,
    Normal,
    Closed
}

export enum ApplicationHandler {
    WebBrowser,
    FileExplorer
}

export enum StartMenuItemType {
    Power
}

export enum OSItemType {
    File,
    Drive,
    Directory,
    FileShortcut,
    DirectoryShortcut
}

export enum SystemState {
    On,
    Off,
    Sleeping
}

export enum WindowType {
    File,
    Directory,
    Settings
}

export enum HandlerType {
    Click,
    Expand,
    Drag
}

export enum ExpandDirection {
    Top = 1 << 0,
    Bottom = 1 << 1,
    Left = 1 << 2,
    Right = 1 << 3,
    TopLeft = 1 << 4,
    TopRight = 1 << 5,
    BottomLeft = 1 << 6,
    BottomRight = 1 << 7
}