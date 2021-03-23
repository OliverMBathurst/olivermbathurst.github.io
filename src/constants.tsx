import IFooterLink from "./interfaces/footer";
import IHeader from "./interfaces/header";
import { CellType } from "./enums/cellType";
import githubIcon from "./assets/icons/github.png";
import linkedinIcon from "./assets/icons/linkedin.png";
import cvIcon from "./assets/icons/CV.png";

export const DefaultRowCount: number = 200;
export const DefaultColumnCount: number = 200;
export const DefaultBoxWidth: number = 17;
export const DefaultBoxHeight: number = 17;
export const FoodChance: number = 0.995;
export const Interval: number = 5;
export const InitialSnakeLength: number = 5;

export const footerLinks: IFooterLink[] = [
  {
    title: "GitHub",
    link: "https://github.com/OliverMBathurst",
    id: 0,
    image: {
      uri: githubIcon,
      altText: "GitHub",
    },
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/oliverbathurst/",
    id: 1,
    image: {
      uri: linkedinIcon,
      altText: "LinkedIn",
    },
  },
  {
    title: "CV",
    link:
      "https://github.com/OliverMBathurst/Curriculum-Vitae/raw/master/Oliver%20Bathurst%20CV.pdf",
    id: 2,
    image: {
      uri: cvIcon,
      altText: "CV",
    },
  },
];

export const sourceCodeLink: IFooterLink = {
  title: "</>",
  link: "https://github.com/OliverMBathurst/olivermbathurst.github.io",
  id: 3,
  image: null,
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

export const validKeyCodes: string[] = [
  "KeyP",
  "KeyR",
  "KeyD",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
];
