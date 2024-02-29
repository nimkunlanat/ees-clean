import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class DocumentApprovedDetail extends EntityBase {
    documentNo: Guid;
    evaluateGroupCode: string;
    evaluateDetailCode: string;
    point: number;

}
