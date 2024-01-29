import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class Province extends EntityBase {
    provinceCode: Guid;
    provinceTh: string;
    provinceEn: string;
    active: boolean;
    description: string;
}
