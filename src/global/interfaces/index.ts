import {
    IWindowSize,
    IWindow,
    IWindowState,
    IWindowParams
} from './window/interfaces'

import {
    IWindowManager,
    IHandlerManager,
    IDriveManager
} from './managers/interfaces'

import {
    IIdentifiable,
    IIdPositionModel,
    IIdReferenceModel,
    IIdDefinedReferenceModel
} from './id/interfaces'

import {
    ISpecialDirectory,
    IFile,
    IDirectory,
    IFileSystem,
    IDriveItem,
    IHydratedDirectory,
    IVirtualDirectory,
    ISystemItem,
    IShortcut,
    IUrlFileContents,
    IDrive,
    IDirectoryLocationInformation,
    IGenericFileContents
} from './fileSystem/interfaces'

import {
    IDragHandler,
    IClickHandler,
    IExpandHandler,
    IClickHandlerOptions,
    IApplicationHandler,
    IDragHandlerOptions
} from './handlers/interfaces'

import {
    IDesktopDisplayItem,
    IDesktopItem,
    IStartMenuItem
} from './desktop/interfaces'

import { IDragCompletedEvent, IOSItemClickedEvent } from './events/interfaces'

import { IRectangle, ISize } from './shape/interfaces'

import { IIdHelper } from './helpers/interfaces'

import { IPositioned, ICoordinates, ILineCoordinates } from './location/interfaces'

import { IIconProps } from './icon/interfaces'

export type {
    IWindowSize,
    IWindow,
    IWindowState,
    IWindowParams,
    IWindowManager,
    IHandlerManager,
    IDriveManager,
    IIdentifiable,
    IIdPositionModel,
    IIdReferenceModel,
    IIdDefinedReferenceModel,
    ISpecialDirectory,
    IFile,
    IDirectory,
    IFileSystem,
    IDriveItem,
    IHydratedDirectory,
    IVirtualDirectory,
    ISystemItem,
    IShortcut,
    IGenericFileContents,
    IUrlFileContents,
    IDrive,
    IDirectoryLocationInformation,
    IDragHandler,
    IClickHandler,
    IExpandHandler,
    IClickHandlerOptions,
    IApplicationHandler,
    IDragHandlerOptions,
    IRectangle,
    IIdHelper,
    ISize,
    IPositioned,
    ICoordinates,
    ILineCoordinates,
    IDragCompletedEvent,
    IOSItemClickedEvent,
    IDesktopDisplayItem,
    IDesktopItem,
    IStartMenuItem,
    IIconProps
}