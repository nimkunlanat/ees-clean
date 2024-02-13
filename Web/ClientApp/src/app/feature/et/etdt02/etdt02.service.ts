import { getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Approve } from '@app/models/et/approve';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etdt02Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = "", assessment: string): Observable<Approve[]> => this.http.disableLoading().put<Approve[]>("etdt02/list", { params: { keywords, assessment } })

  document = (): Observable<Approve[]> => this.http.get<Approve[]>('etdt02/document')

}
