import { IPositioned } from "..";

export interface IIdReferenceModel extends IIdentifiable {
    reference: React.RefObject<HTMLDivElement> | undefined
}

export interface IIdDefinedReferenceModel extends IIdentifiable {
    reference: React.RefObject<HTMLDivElement>
}

export interface IIdPositionModel extends IIdentifiable, IPositioned { }

export interface IIdentifiable {
    id: string
}

