export function clone(obj) {
    return JSON.parse(JSON.stringify(obj))      
}

export function merge(arrOld, arrNew) {
    if (arrNew.length === 0) {
        return arrNew
    }
    let rowMax = arrNew.length >= arrOld.length ? arrOld.length : arrNew.length
    let columnMax = arrNew[0].length >= arrOld[0].length ? arrOld[0].length : arrNew[0].length

    for (var i = 0; i < rowMax; i++) {
        for (var j = 0; j < columnMax; j++) {
        arrNew[i][j] = arrOld[i][j]
        }
    }
    return arrNew
}

export function links() {
    return [
        {
            title: 'GitHub', 
            link: 'https://github.com/OliverMBathurst'
        },
        {
            title: 'LinkedIn', 
            link: 'https://www.linkedin.com/in/oliverbathurst/'
        },
        {
            title: 'CV', 
            link: 'https://github.com/OliverMBathurst/Curriculum-Vitae/raw/master/Oliver%20Bathurst%20CV.pdf'
        }
    ];
}

export function headings() {
    return [
        {
            title: "Oliver Bathurst",
            class: "heading"
        },
        {
            title: "Full-Stack Developer",
            class: "sub-heading"
        }
    ]
}