import { EntityBase } from "../entityBase";
import { EvaluationGroup } from "./evaluationGroup";

export class EvaluationForm extends EntityBase {
    roleCode: string;
    roleNameTh: string;
    roleNameEn: string;
    languageCode: string;
    active: boolean;
    evaluationGroups:  EvaluationGroup[]

    constructor() {
        super();
        this.evaluationGroups = []
    }

}