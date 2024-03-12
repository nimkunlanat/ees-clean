import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class DocumentApprovedDetail extends EntityBase {
    documentNo: Guid;
    documentdetailNo: Guid;
    evaluateDetailCode: Guid;
    point?: number;
}
