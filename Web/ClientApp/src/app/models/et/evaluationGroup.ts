import { EntityBase } from "../entityBase";
import { EvaluateDetail } from "./evaluationDetail";

export class EvaluationGroup extends EntityBase {
    evaluateGroupCode: string;
    evaluateGroupNameTh: string;
    evaluateGroupNameEn: string;
    roleCode: string;
    sequeneId: number;
    totalPoint: number;
    lanuageCode: string;
    active: boolean;
    evaluateDetails:  EvaluateDetail[]

    constructor() {
        super();
        this.evaluateDetails = []
    }
}