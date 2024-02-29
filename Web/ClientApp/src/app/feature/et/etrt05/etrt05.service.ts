import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluateForm } from '@app/models/et/evaluateForm';
import { EvaluateGroup } from '@app/models/et/evaluateGroup';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etrt05Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<EvaluateForm[]> => this.http.disableLoading().get<EvaluateForm[]>("etrt05/list", { params: { keywords } })

  evaluation = (keywords: string = "", roleCode: string): Observable<EvaluateGroup[]> => this.http.get<EvaluateGroup[]>("etrt05/evaluation", { params: { Keywords : keywords, RoleCode : roleCode } })
  
  detail = (evaluateGroupCode: string): Observable<EvaluateGroup> => this.http.get<EvaluateGroup>("etrt05/detail", { params: { EvaluateGroupCode : evaluateGroupCode } })
  
  delete = (evaluateGroupCode: any) => this.http.delete("etrt05/delete", { params: { evaluateGroupCode } })

  save = (data) => this.http.post('etrt05/update', data);

  saveForm = (data) => this.http.post('etrt05/saveForm', data);

  deleteForm = (roleCode: string) => this.http.delete("etrt05/deleteForm", { params: { roleCode} })

}
