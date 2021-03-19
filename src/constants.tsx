import IFooterLink from "./interfaces/footer";
import IHeader from "./interfaces/header";
import { CellType } from "./enums/cellType";

export const DefaultRowCount: number = 200;
export const DefaultColumnCount: number = 200;
export const DefaultBoxWidth: number = 17;
export const DefaultBoxHeight: number = 17;
export const FoodChance: number = 0.5;
export const Interval: number = 5;
export const InitialSnakeLength: number = 5;

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

export const cellClasses: { [index: number]: string } = {
  [CellType.Snake]: "snake",
  [CellType.Normal]: "normal",
  [CellType.Food]: "food",
  [CellType.Debug]: "debug",
};

export const validKeyCodes: number[] = [39, 37, 40, 38, 80, 82, 68];
