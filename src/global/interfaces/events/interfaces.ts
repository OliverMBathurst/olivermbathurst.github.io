import { IIdentifiable, IPositioned } from "..";
import { OSItemType } from "../../enums";

export interface IDragCompletedEvent extends IIdentifiable, IPositioned { }

export interface IOSItemClickedEvent extends IIdentifiable {
    type: OSItemType
    driveId: string | undefined
}