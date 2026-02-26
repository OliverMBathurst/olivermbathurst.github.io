import InfoCard from "./infoCard"

export enum InfoCardClickAction {
    Open,
    OpenFileLocation,
    CopyPath
}

export interface IInfoCardClickOption {
    title: string
    action: InfoCardClickAction
}

export interface IInfoCardInformationRow {
    title: string
    value: string
}

export interface IInfoCardContext {
    type: InfoCardType
    informationRows: IInfoCardInformationRow[]
    clickOptions: IInfoCardClickOption[]
}

export enum InfoCardType {
    App = "App",
    Branch = "Folder",
    File = "File"
}

export { InfoCard }