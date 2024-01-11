import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class Status extends EntityBase {
    id: Guid;
    tableName: string;
    columnName: string;
    code: string;
    descTh: string;
    descEn: string;
    seq: number;
    remark: string;
    active: boolean;
    backgroundColor: string;
    fontColor: string;
}
