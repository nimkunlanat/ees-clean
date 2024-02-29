import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentApproved } from '@app/models/et/documentApproved';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etdt01Service {
  constructor(private http: HttpClient) { }
  listAssessment = (): Observable<any[]> => this.http.disableLoading().get<any[]>("etdt01/listAssessment")

  listSkillmatrix = (): Observable<any[]> => this.http.disableLoading().get<any[]>("etdt01/listSkillmatrix")

  calculate = (DateFrom?: Date, DateTo?: Date): Observable<any[]> => {
    return this.http.disableLoading().get<any[]>("etdt01/calculate", {
        params: {
            dateFrom: DateFrom?.toISOString(),
            dateTo: DateTo?.toISOString()
        }
    });
}

  detail = (DocumentNo:Guid) => this.http.get<DocumentApproved>('etdt01/detail', { params: { DocumentNo : DocumentNo.toString()} })

  save = (data:DocumentApproved) => this.http.post("etdt01/update", data);
}
