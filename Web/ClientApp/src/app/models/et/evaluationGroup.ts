import { EntityBase } from "../entityBase";
import { EvaluationDetail } from "./evaluationDetail";

export class EvaluationGroup extends EntityBase {
    evaluateGroupCode: string;
    evaluateGroupNameTh: string;
    evaluateGroupNameEn: string;
    squeneId: number;
    totalPoint: number;
    lanuageCode: string;
    active: boolean;
    evaluateDetailCodes:  EvaluationDetail[]

    constructor() {
        super();
        this.evaluateDetailCodes = []
    }
}