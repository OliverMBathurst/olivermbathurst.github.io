import IFooterLink from "../interfaces/footer";
import IHeader from "../interfaces/header";
import { CellType } from "../enums/cellType";
import { Direction } from "../enums/direction";

export const footerLinks: IFooterLink[] = [
  {
    title: "GitHub",
    link: "https://github.com/OliverMBathurst",
    id: 0,
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/oliverbathurst/",
    id: 1,
  },
  {
    title: "CV",
    link:
      "https://github.com/OliverMBathurst/Curriculum-Vitae/raw/master/Oliver%20Bathurst%20CV.pdf",
    id: 2,
  },
];

export const sourceCodeLink: IFooterLink = {
  title: "🐍 Source Code",
  link: "https://github.com/OliverMBathurst/olivermbathurst.github.io",
  id: 3,
};

export const headings: IHeader[] = [
  {
    title: "Oliver Bathurst",
    class: "heading",
  },
  {
    title: "Full-Stack Developer",
    class: "sub-heading",
  },
];

export const cellStyles: { [index: number]: string } = {
  [CellType.Snake]: "snake",
  [CellType.Normal]: "normal",
  [CellType.Food]: "food",
};

// eslint-disable-next-line no-useless-computed-key
export const directionMappings: { [index: number]: Direction } = {
  [0]: Direction.Fixed,
  [1]: Direction.Down,
  [2]: Direction.Right,
  [3]: Direction.Left,
  [4]: Direction.Up,
};

export const validKeyCodes: number[] = [39, 37, 40, 38];
