import { EntityBase } from "../entityBase";
import { EvaluateDetail } from "./evaluateDetail";

export class EvaluateGroup extends EntityBase {
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