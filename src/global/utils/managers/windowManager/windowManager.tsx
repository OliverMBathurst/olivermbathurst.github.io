import { WindowState } from "../../../enums"
import { IDragCompletedEvent, IWindow, IWindowManager, IWindowSize } from "../../../interfaces"
import { getMaxWindowHeight, getMaxWindowWidth } from "../../helpers/windowHelper"

class WindowManager implements IWindowManager {
    windows: IWindow[] = []
    windowCount: number = 0

    onWindowStateChanged = (id: string, state: WindowState): IWindow[] => {
        var windowsCopy = [...this.windows]
        var idx = windowsCopy.findIndex(x => x.id === id)
        if (idx !== -1) {
            switch (state) {
                case WindowState.Maximized:
                    windowsCopy[idx].size = { width: getMaxWindowWidth(0), height: getMaxWindowHeight(0) }
                    windowsCopy[idx].position = { x: 0, y: 0 }
                    break
                case WindowState.Closed:
                    windowsCopy.splice(idx, 1)
                    break
                case WindowState.Minimized:
                    windowsCopy[idx].selected = false
                    break
            }

            if (state !== WindowState.Closed) {
                windowsCopy[idx].state = state
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
                    window.state = WindowState.Normal
                    for (var win of windowsCopy) {
                        win.selected = false
                    }
                    window.selected = true
                    break;
                case WindowState.Normal:
                case WindowState.Maximized:
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
        window.id = this.getNewWindowId()

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

    private getNewWindowId = () => {
        this.windowCount++
        return `window-${this.windowCount}`
    }
}

export default WindowManager