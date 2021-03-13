import IFooterLink from "../interfaces/footer";
import IHeader from "../interfaces/header";

export const footerLinks: IFooterLink[] = [
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

export const headings: IHeader[] = [
    {
        title: "Oliver Bathurst",
        class: "heading"
    },
    {
        title: "Full-Stack Developer",
        class: "sub-heading"
    }
];

export const merge = (arrOld: boolean[][], arrNew: boolean[][]): boolean[][] => {
    if (arrNew.length === 0) {
        return arrNew;
    }

    let rowMax = arrNew.length >= arrOld.length ? arrOld.length : arrNew.length;
    let columnMax = arrNew[0].length >= arrOld[0].length ? arrOld[0].length : arrNew[0].length;

    for (var i = 0; i < rowMax; i++) {
        for (var j = 0; j < columnMax; j++) {
            arrNew[i][j] = arrOld[i][j];
        }
    }
    return arrNew;
}