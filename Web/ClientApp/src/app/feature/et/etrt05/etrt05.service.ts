import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluationForm } from '@app/models/et/evaluationForm';
import { EvaluationGroup } from '@app/models/et/evaluationGroup';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etrt05Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<EvaluationForm[]> => this.http.disableLoading().get<EvaluationForm[]>("etrt05/list", { params: { keywords } })

  evaluation = (keywords: string = "", roleCode: string): Observable<EvaluationGroup[]> => this.http.get<EvaluationGroup[]>("etrt05/evaluation", { params: { Keywords : keywords, RoleCode : roleCode } })
  
  detail = (evaluateGroupCode: string): Observable<EvaluationGroup> => this.http.get<EvaluationGroup>("etrt05/detail", { params: { EvaluateGroupCode : evaluateGroupCode } })
  
  delete = (evaluateGroupCode: any) => this.http.delete("etrt05/delete", { params: { evaluateGroupCode } })

  save = (data) => this.http.post('etrt05/update', data);

}
