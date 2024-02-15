import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";

export class SkillMatrixSubject extends EntityBase {
    subjectId: Guid;
    groupId: Guid;
    subjectGroup: string;
    subjectName: string;
    description: string;
    active: boolean;
}