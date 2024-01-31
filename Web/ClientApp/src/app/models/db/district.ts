import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class District extends EntityBase {
    districtCode: Guid;
    provinceCode: Guid;
    districtTh: string;
    districtEn: string;
    active: boolean;
    description: string;
}
