import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class Subdistrict extends EntityBase {
    subdistrictCode: Guid;
    provinceCode: Guid;
    districtCode: Guid;
    subdistrictTh: string;
    subdistrictEn: string;
    postalCode: string;
    active: boolean;
    description: string;
}
