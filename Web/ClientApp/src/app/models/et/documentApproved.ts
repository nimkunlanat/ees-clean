import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";
import { DocumentApprovedDetail } from "./documentapprovedDetail";
import { DocumentApprovedSkill } from "./documentapprovedSkill";

export class DocumentApproved extends EntityBase {
    employeeCode: string;
    evaluationStatus: Guid;
    documentNo: Guid;
    approveBy: string;
    documentapprovedDetails : DocumentApprovedDetail[]
    documentapprovedSkills : DocumentApprovedSkill[]

    constructor(){
      super();
      this.documentapprovedDetails = []
      this.documentapprovedSkills = []
    }
}
