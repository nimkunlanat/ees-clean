import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvaluationGroup } from '@app/models/et/evaluationGroup';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etrt05Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<EvaluationGroup[]> => this.http.disableLoading().get<EvaluationGroup[]>("etrt05/list", { params: { keywords } })

  delete = (evaluateGroupCode: any) => this.http.delete("etrt05/delete", { params: { evaluateGroupCode } })

  detail = (evaluateGroupCode: string): Observable<EvaluationGroup> => this.http.get<EvaluationGroup>("etrt05/detail", { params: { evaluateGroupCode } })

  save = (data) => this.http.post('etrt05/update', data);
}
