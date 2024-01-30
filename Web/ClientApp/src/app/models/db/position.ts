import { EntityBase } from "../entityBase";

export class Position extends EntityBase {
    positionCode: string;
    positionNameTh: string;
    positionNameEn: string;
    description: string;
    active: boolean; 
}