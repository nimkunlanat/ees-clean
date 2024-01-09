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
}
