import { EntityBase } from "../entityBase";

export class Approve extends EntityBase {
    db_number: string;
    employee_code: string;
    active: boolean; 
}