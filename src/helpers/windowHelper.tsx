import { DefaultBoxHeight, DefaultBoxWidth } from "../constants";
import IWindowParameters from "../interfaces/windowParameters";

export default class WindowHelper {
  static getNewWindowParams = (): IWindowParameters => {
    return {
      width: Math.floor(window.innerWidth / DefaultBoxWidth),
      height: Math.floor(window.innerHeight / DefaultBoxHeight),
    };
  };
}
