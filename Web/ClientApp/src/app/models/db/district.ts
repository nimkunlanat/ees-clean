import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class District extends EntityBase {
    districtCode: Guid;
    provinceCode: Guid;
    // provinceTh: string;
    districtTh: string;
    drovinceEn: string;
    active: boolean;
    description: string;
}
