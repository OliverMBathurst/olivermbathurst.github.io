export const isMouseDownLeftClick = <T extends HTMLElement>(e: React.MouseEvent<T, MouseEvent> | MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return false;
    }

    if ('buttons' in e) {
        return e.buttons === 1;
    }

    return false
}