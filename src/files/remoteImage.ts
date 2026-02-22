import { AbstractLeaf, BranchingContext } from "../types/fs"

class RemoteImage extends AbstractLeaf {
	data: string | null = null

	constructor(name: string, extension: string, parent: BranchingContext, url: string) {
		super(name, extension, parent)
		this.windowTopBarCustomIconDisplay = false
		this.fetchResource(url)
	}

	async fetchResource(url: string) {
		fetch(url)
			.then(response => {
				response.blob().then(b => {
					const reader = new FileReader()
					reader.readAsDataURL(b)
					reader.onload = () => {
						const result = reader.result
						if (!(result instanceof ArrayBuffer)) {
							this.data = result
							this.icon = result
						}
					}
				})
				
		})
	}
}

export default RemoteImage