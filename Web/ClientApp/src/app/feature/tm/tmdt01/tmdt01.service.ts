import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { teamManagement } from '@app/models/tm/teamManagement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Tmdt01Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<teamManagement[]> => this.http.disableLoading().get<teamManagement[]>("tmdt01/list", { params: { keywords } })
  saveList = (keywords: string = ""): Observable<teamManagement[]> => this.http.disableLoading().get<teamManagement[]>("tmdt01/saveList", { params: { keywords } })
  save = (data) => this.http.post('tmdt01/create', data);
}
