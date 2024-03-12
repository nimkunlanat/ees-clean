import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";
import { SkillMatrixGrade } from "./skillMatrixGrade";

export class SkillMatrixSubject extends EntityBase {
    subjectId: Guid;
    groupId: Guid;
    subjectGroup: string;
    subjectName: string;
    description: string;
    active: boolean;
    expectedGrade: string;
    skillMatrixGrades: SkillMatrixGrade[]

    constructor(){
        super();
        this.skillMatrixGrades = []
    }
}