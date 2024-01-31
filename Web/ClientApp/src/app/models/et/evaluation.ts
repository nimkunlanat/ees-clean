import { EntityBase } from "../entityBase";

export class Evaluation extends EntityBase{
    evaluateGroupCode: string;
    evaluateDetailNameTh: string;
    evaluateDetailNameEn: string;
    squeneId: number;
    point: number;
    lanuageCode: string;
    active: boolean;
}