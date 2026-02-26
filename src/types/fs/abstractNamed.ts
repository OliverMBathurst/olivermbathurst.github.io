abstract class AbstractNamed {
	name: string
	fullName: string

	constructor(name: string, fullName: string) {
		this.name = name
		this.fullName = fullName
	}

	abstract toContextUniqueKey: () => string
}

export default AbstractNamed
