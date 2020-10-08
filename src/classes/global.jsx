export function clone(obj) {
    return JSON.parse(JSON.stringify(obj))      
}

export function merge(oldGrid, newGrid) {
    if (newGrid.length === 0) {
        return newGrid
    }
    let rowMax = newGrid.length >= oldGrid.length ? oldGrid.length : newGrid.length
    let columnMax = newGrid[0].length >= oldGrid[0].length ? oldGrid[0].length : newGrid[0].length

    for (var i = 0; i < rowMax; i++) {
        for (var j = 0; j < columnMax; j++) {
        newGrid[i][j] = oldGrid[i][j]
        }
    }
    return newGrid
}

export function links() {
    return [
        {
            Title: 'GitHub', 
            Link: 'https://github.com/OliverMBathurst'
        },
        {
            Title: 'LinkedIn', 
            Link: 'https://www.linkedin.com/in/oliverbathurst/'
        },
        {
            Title: 'CV', 
            Link: 'https://github.com/OliverMBathurst/Curriculum-Vitae/raw/master/Oliver%20Bathurst%20CV.pdf'
        }
    ];
}