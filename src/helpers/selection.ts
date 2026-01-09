export const doRectanglesIntersect = (r: DOMRect, r1: DOMRect): boolean => {
	return !(r1.left > r.right ||
		r1.right < r.left ||
		r1.top > r.bottom ||
		r1.bottom < r.top);
}