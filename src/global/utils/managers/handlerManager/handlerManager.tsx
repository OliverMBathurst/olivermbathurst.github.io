import { WindowHandlerType } from "../../../enums"
import { IClickHandler, IDragHandler, IExpandHandler, IHandlerManager, IIdDefinedReferenceModel } from "../../../interfaces"

class HandlerManager implements IHandlerManager {
    private dragHandlers: Map<string, IDragHandler> = new Map()
    private clickHandlers: Map<string, IClickHandler> = new Map()
    private expandHandlers: Map<string, IExpandHandler> = new Map()

    addDragHandler = (id: string, handler: IDragHandler) => {
        if (!this.dragHandlers.has(id)) {
            this.dragHandlers.set(id, handler)
        }
    }

    addClickHandler = (id: string, handler: IClickHandler) => {
        if (!this.clickHandlers.has(id)) {
            this.clickHandlers.set(id, handler)
        }
    }

    addExpandHandler = (id: string, handler: IExpandHandler) => {
        if (!this.expandHandlers.has(id)) {
            this.expandHandlers.set(id, handler)
        }
    }

    handlerExists = (id: string, type: WindowHandlerType): boolean => {
        switch (type) {
            case WindowHandlerType.Click:
                return this.clickHandlers.has(id)
            case WindowHandlerType.Drag:
                return this.dragHandlers.has(id)
            case WindowHandlerType.Expand:
                return this.expandHandlers.has(id)
        }
    }

    removeHandler = (id: string, type: WindowHandlerType) => {
        switch (type) {
            case WindowHandlerType.Click:
                this.clickHandlers.delete(id)
                break
            case WindowHandlerType.Drag:
                this.dragHandlers.delete(id)
                break
            case WindowHandlerType.Expand:
                this.expandHandlers.delete(id)
                break
        }
    }

    setDragHandlerSelected = (id: string, selected: IIdDefinedReferenceModel[]) => {
        var dragHandler = this.dragHandlers.get(id)
        if (dragHandler) {
            dragHandler.selectedItemsGroup = selected
            this.dragHandlers.set(id, dragHandler)
        }
    }
}

export default HandlerManager