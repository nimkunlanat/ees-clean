import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityLog } from '@app/models/su/activityLog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Surt08Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ''): Observable<ActivityLog[]> => this.http.disableLoading().get<ActivityLog[]>("surt08/list", { params: { keywords } });
}
