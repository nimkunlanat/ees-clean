import { EntityBase } from "../entityBase";

export class EvaluateDetail extends EntityBase{
    evaluateGroupCode: string
    evaluateDetailCode: string
    evaluateDetailNameTh: string
    evaluateDetailNameEn: string
    sequeneId: number;
    point: number;
    lanuageCode: string;
    active: boolean;
}