import { EntityBase } from "../entityBase";
import { EvaluateGroup } from "./evaluateGroup";

export class EvaluateForm extends EntityBase {
    roleCode: string;
    roleNameTh: string;
    roleNameEn: string;
    languageCode: string;
    sequeneId: string;
    active: boolean;
    evaluateGroups:  EvaluateGroup[]

    constructor() {
        super();
        this.evaluateGroups = []
    }

}