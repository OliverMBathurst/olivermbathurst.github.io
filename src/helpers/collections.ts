export const chunk = <T>(collection: T[], size: number): T[][] => {
    const collections: T[][] = []
    collections.push([])

    let sI = 0
    for (let i = 0; i < collection.length; i++) {
        if (sI === size) {
            collections.push([])
            sI = 0
        }
        collections[collections.length - 1].push(collection[i])

        sI++
    }

    return collections
}