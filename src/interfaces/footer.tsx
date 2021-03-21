import IImage from "../interfaces/image";

export default interface IFooterLink {
  title: string;
  link: string;
  id: number;
  image: IImage | null;
}
