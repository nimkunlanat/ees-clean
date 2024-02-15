import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";
import { DocumentApprovedDetail } from "./documentapprovedDetail";

export class DocumentApproved extends EntityBase {
    employeeCode: string;
    evaluationStatus: string;
    documentNo: Guid;
    approveBy: string;
    documentapprovedDetail : DocumentApprovedDetail[]

    constructor(){
      super();
      this.documentapprovedDetail =[]
    }
}
