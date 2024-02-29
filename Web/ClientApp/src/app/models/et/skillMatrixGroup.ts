import { EntityBase } from "../entityBase"
import { Guid } from "guid-typescript"
import { SkillMatrixSubject } from "./skillMatrixSubject";

export class SkillMatrixGroup extends EntityBase {
    groupId: Guid;
    groupName: string;
    description: string;
    active: boolean;
    skillMatrixSubjects: SkillMatrixSubject[]

    constructor() {
        super();
        this.skillMatrixSubjects = []
    }
}