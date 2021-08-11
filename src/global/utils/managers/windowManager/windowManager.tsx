import { WindowState } from "../../../enums"
import { IDragCompletedEvent, IIdHelper, IWindow, IWindowManager, IWindowSize } from "../../../interfaces"
import { getMaxWindowHeight, getMaxWindowWidth } from "../../helpers/windowHelper"

class WindowManager implements IWindowManager {
    windows: IWindow[] = []
    private idHelper: IIdHelper

    constructor(idHelper: IIdHelper) {
        this.idHelper = idHelper
    }

    onWindowNameChanged = (id: string, newName: string) => {
        var windowsCopy = [...this.windows]

        var idx = windowsCopy.findIndex(w => w.id === id)
        if (idx !== -1) {
            windowsCopy[idx].name = newName
            this.windows = windowsCopy
        }
        
        return this.windows
    }

    onWindowStateChanged = (id: string, state: WindowState): IWindow[] => {
        var windowsCopy = [...this.windows]
        var idx = windowsCopy.findIndex(x => x.id === id)
        if (idx !== -1) {
            var win = {...windowsCopy[idx]}
            switch (state) {
                case WindowState.Maximized:
                    win.size = { width: getMaxWindowWidth(0), height: getMaxWindowHeight(0) }
                    win.position = { x: 0, y: 0 }
                    break
                case WindowState.Closed:
                    windowsCopy.splice(idx, 1)
                    break
                case WindowState.Minimized:
                    win.selected = false
                    break
            }

            if (state !== WindowState.Closed) {
                win.previousState = win.state
                win.state = state
                windowsCopy[idx] = win
            }            

            this.windows = windowsCopy
        }

        return this.windows
    }

    onWindowSelected = (id: string): IWindow[] => {
        var windowsCopy = [...this.windows]

        var idx = windowsCopy.findIndex(w => w.id === id)
        if (idx !== -1) {
            for (var win of windowsCopy) {
                win.selected = false
            }

            windowsCopy[idx].selected = true
            this.windows = windowsCopy
        }

        return this.windows
    }

    onWindowPositionChanged = (completedDrags: IDragCompletedEvent[]): IWindow[] => {
        var windowsCopy = [...this.windows]

        for (const drag of completedDrags) {
            var windowIdx = windowsCopy.findIndex(x => x.id === drag.id)
            if (windowIdx !== -1) {
                windowsCopy[windowIdx].position = drag.position
            }
        }

        this.windows = windowsCopy
        return this.windows
    }

    onWindowClicked = (id: string): IWindow[] => {
        var windowsCopy = [...this.windows]
        var idx = windowsCopy.findIndex(x => x.id === id)
        if (idx !== -1) {
            if (!windowsCopy[idx].selected) {
                for (var window of windowsCopy) {
                    window.selected = false
                }

                windowsCopy[idx].selected = true
                this.windows = windowsCopy
            }
        }

        return this.windows
    }

    onTaskbarItemClicked = (id: string) => {
        var windowsCopy = [...this.windows]
        var idx = windowsCopy.findIndex(x => x.id === id)
        if (idx !== -1) {
            var window = windowsCopy[idx]

            switch (window.state) {
                case WindowState.Minimized:
                    window.state = window.previousState ? window.previousState : WindowState.Normal
                    window.previousState = WindowState.Minimized
                    for (var win of windowsCopy) {
                        win.selected = false
                    }
                    window.selected = true
                    break;
                case WindowState.Normal:
                    window.previousState = WindowState.Normal
                    window.state = WindowState.Minimized
                    window.selected = false
                    break
                case WindowState.Maximized:
                    window.previousState = WindowState.Maximized
                    window.state = WindowState.Minimized
                    window.selected = false
                    break;
            }

            windowsCopy[idx] = window
            this.windows = windowsCopy
        }

        return this.windows
    }

    onTaskbarItemDoubleClicked = (id: string) => {
        return this.windows
    }
        

    onWindowSizeChanged = (id: string, size: IWindowSize): IWindow[] => {
        var windowsCopy = [...this.windows]

        var idx = windowsCopy.findIndex(w => w.id === id)
        if (idx !== -1) {
            windowsCopy[idx].size = size
        }

        this.windows = windowsCopy
        return this.windows
    }

    addWindow = (window: IWindow): IWindow[] => {
        var windowsCopy = [...this.windows]

        window.selected = true
        window.id = this.idHelper.getNewWindowId()

        for (var win of windowsCopy) {
            win.selected = false
        }

        windowsCopy.push(window)
        this.windows = windowsCopy

        return this.windows
    }

    minimizeAllWindows = (): IWindow[] => {
        var windowsCopy = [...this.windows]
        for (var window of windowsCopy) {
            window.state = WindowState.Minimized
        }

        this.windows = windowsCopy
        return this.windows
    }
}

export default WindowManager