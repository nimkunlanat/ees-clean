import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class Approve extends EntityBase {
    employeeCode: string;
    evaluationStatus: string;
    documentNo: Guid; 
    approveBy: string
    evaluated?: number;
    notEvaluated?: number;
}