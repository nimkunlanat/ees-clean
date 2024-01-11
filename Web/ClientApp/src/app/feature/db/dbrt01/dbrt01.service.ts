import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Status } from '@app/models/db/status';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Dbrt01Service {
  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<Status[]> => this.http.disableLoading().get<Status[]>("dbrt01/list", { params: { keywords } })

  detail = (Id: any) => this.http.get<Status>('dbrt01/detail', { params: { Id } })

  save = (data: Status) => this.http.post("dbrt01/update", data);

  delete = (Id: any) => this.http.delete("dbrt01/delete", { params: { Id } })
}
