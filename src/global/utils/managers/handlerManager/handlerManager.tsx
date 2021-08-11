import { HandlerType } from "../../../enums"
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

    handlerExists = (id: string, type: HandlerType): boolean => {
        switch (type) {
            case HandlerType.Click:
                return this.clickHandlers.has(id)
            case HandlerType.Drag:
                return this.dragHandlers.has(id)
            case HandlerType.Expand:
                return this.expandHandlers.has(id)
        }
    }

    removeHandler = (id: string, type: HandlerType) => {
        switch (type) {
            case HandlerType.Click:
                this.clickHandlers.delete(id)
                break
            case HandlerType.Drag:
                this.dragHandlers.delete(id)
                break
            case HandlerType.Expand:
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