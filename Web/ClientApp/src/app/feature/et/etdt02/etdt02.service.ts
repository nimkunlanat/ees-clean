import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Approve } from '@app/models/et/approve';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etdt02Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<Approve[]> => this.http.disableLoading().get<Approve[]>("etdt01/list", { params: { keywords } })
}
