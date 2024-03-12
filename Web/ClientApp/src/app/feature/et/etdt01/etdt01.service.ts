import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentApproved } from '@app/models/et/documentApproved';
import { Guid } from 'guid-typescript';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';

export type Master = {
  Status: SelectItem[];
}
@Injectable({
  providedIn: 'root'
})
export class Etdt01Service {
  constructor(private http: HttpClient) { }
  listAssessment = (documentNo?: Guid) => this.http.disableLoading().get<DocumentApproved[]>("etdt01/listAssessment", { params: { documentNo : documentNo != null ? documentNo.toString() : ''} })

  // listSkillmatrix = (): Observable<any[]> => this.http.disableLoading().get<any[]>("etdt01/listSkillmatrix")

  listSkillmatrix = (documentNo?: Guid) => this.http.disableLoading().get<DocumentApproved[]>("etdt01/listSkillmatrix", { params: { documentNo : documentNo != null ? documentNo.toString() : ''} })

  calculate = (DateFrom?: Date, DateTo?: Date): Observable<any[]> => {
    return this.http.disableLoading().get<any[]>("etdt01/calculate", {
        params: {
            dateFrom: DateFrom?.toISOString(),
            dateTo: DateTo?.toISOString()
        }
    });
}
  list = (): Observable<DocumentApproved[]> => this.http.disableLoading().get<any[]>("etdt01/list")

  save = (data:DocumentApproved) => this.http.post("etdt01/update", data);

  master = () => this.http.get<Master>('etdt01/master');

  delete = (documentNo:Guid) => this.http.delete("etdt01/delete", { params: { documentNo :  documentNo.toString()} })
}
