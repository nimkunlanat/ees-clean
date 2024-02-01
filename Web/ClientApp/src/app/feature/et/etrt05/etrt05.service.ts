import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evaluation } from '@app/models/et/evaluation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etrt05Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<Evaluation[]> => this.http.disableLoading().get<Evaluation[]>("etrt02/list", { params: { keywords } })

  delete = (evaluateGroupCode: any) => this.http.delete("etrt05/delete", { params: { evaluateGroupCode } })
}
