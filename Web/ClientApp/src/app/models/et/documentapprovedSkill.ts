import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class DocumentApprovedSkill extends EntityBase {
    documentNo: Guid;
    documentskillNo: Guid;
    gradeId: Guid;
    description: string;
    grade: string;
    score?: number;
    expectedGrade: string;
}
