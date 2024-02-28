import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";
import { EvaluationDocument } from "./evaluationDocument";

export class DocumentApproved extends EntityBase {
    employeeCode: string;
    evaluationStatus: string;
    documentNo: Guid;
    approveBy: string;
    evaluationDocument : EvaluationDocument[]

    constructor(){
      super();
      this.evaluationDocument =[]
    }
}
