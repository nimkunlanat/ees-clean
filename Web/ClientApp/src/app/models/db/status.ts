import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class Status extends EntityBase {
    Id: Guid;
    TableName: string;
    ColumnName: string;
    Code: string;
    DescTH: string;
    DescEN: string;
    Seq: number;
    Remark: string;
    Active: boolean;
    BackgroundColor: string;
    FontColor: string;

    constructor() {
        super();
    }
}
