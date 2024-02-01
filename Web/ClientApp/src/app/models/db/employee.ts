import { Guid } from "guid-typescript";
import { EntityBase } from "../entityBase";


export class Employee extends EntityBase {
    employeeCode: string;
    employeeName: string;
    employeeFirstnameTh: string;
    employeeSurnameTh: string;
    employeeFirstnameEn: string;
    employeeSurnameEn: string;
    positionName : string;
    teamCode: Guid;
    gender: string;
    dateOfBirth: Date;
    nationality: string;
    religion: string;
    phoneNumber: number;
    email: string;
    positionCode: string;
    userName: string;
    sequeneId: Guid;
    languageCode: string;
    active: boolean;
}
