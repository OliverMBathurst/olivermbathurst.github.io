import { Context } from "."
import { IShortcut } from "../../interfaces/fs"

class Shortcut implements IShortcut {
	private _name: string
	context: Context

	constructor(context: Context, name: string) {
		this.context = context
		this._name = name
	}

	get name() {
		return `${this._name} (Shortcut)`
	}

	toContextUniqueKey: () => string = () =>
		`${this.name}-${this.context.name}-shortcut`
}

export default Shortcut
