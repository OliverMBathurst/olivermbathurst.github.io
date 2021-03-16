import { Direction } from '../enums/direction';
import ICoordinates from './coordinates';

export default interface ISnake {
    direction: Direction;
    cells: ICoordinates[];
}