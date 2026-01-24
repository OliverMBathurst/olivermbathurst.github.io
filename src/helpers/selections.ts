import { Context } from "../types/fs"

export const doRectanglesIntersect = (r: DOMRect, r1: DOMRect): boolean => {
	return !(
		r1.left > r.right ||
		r1.right < r.left ||
		r1.top > r.bottom ||
		r1.bottom < r.top
	)
}

export const onSelectionRowClicked = <T, T2 extends HTMLElement>(
	context: Context,
	e: React.MouseEvent<T2, MouseEvent>,
	selectedContextKeys: string[],
	items: T[],
	predicate: (item: T) => string
) => {
	 return onSelectionRowClickedInternal(
		context,
		selectedContextKeys,
		items,
		predicate,
		e
	)
}

export const onMixedSelectionRowClicked = <T, T2>(
	context: Context,
	selectCollectionOne: boolean,
	e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	selectedContextKeys: string[],
	items: T[],
	itemsTwo: T2[],
	predicate: (item: T) => string,
	predicateTwo: (item: T2) => string
) => {
	let newSelectedContextKeys = []
	if (selectCollectionOne) {
		newSelectedContextKeys = onSelectionRowClickedInternal(
			context,
			selectedContextKeys,
			items,
			predicate,
			e
		)
	} else {
		newSelectedContextKeys = onSelectionRowClickedInternal(
			context,
			selectedContextKeys,
			itemsTwo,
			predicateTwo,
			e
		)
	}

	return newSelectedContextKeys
}

export const onSelectionRowClickedInternal = <T, T2 extends HTMLElement>(
	context: Context,
	selectedContextKeys: string[],
	items: T[],
	predicate: (item: T) => string,
	e: React.MouseEvent<T2, MouseEvent>
) => {
	const contextKey = context.toContextUniqueKey()

	if (e.shiftKey) {
		if (selectedContextKeys.length === 0) {
			return [contextKey]
		} else {
			if (
				selectedContextKeys.length === 1 &&
				selectedContextKeys[0] === contextKey
			) {
				return [contextKey]
			}

			const identities = items.map((x) => predicate(x))

			const initialSelectionIndex = identities.indexOf(selectedContextKeys[0])
			const newSelectionIndex = identities.indexOf(contextKey)

			const newSelection: string[] = [selectedContextKeys[0]]

			if (newSelectionIndex > initialSelectionIndex) {
				for (let i = initialSelectionIndex + 1; i <= newSelectionIndex; i++) {
					newSelection.push(identities[i])
				}
			} else {
				for (let i = newSelectionIndex; i < initialSelectionIndex; i++) {
					newSelection.push(identities[i])
				}
			}

			return newSelection
		}
	} else if (e.ctrlKey) {
		if (selectedContextKeys.indexOf(contextKey) === -1) {
			return [...selectedContextKeys, contextKey]
		} else {
			return [...selectedContextKeys].filter((x) => x !== contextKey)
		}
	} else {
		return [contextKey]
	}
}
