import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class SkillMatrixGrade extends EntityBase {
    gradeId: Guid;
    subjectId: Guid;
    grade: string;
    score: number;
    description: string;
    example: string;
    contentId: number;
    expectedScore: number;
    active: boolean;

}