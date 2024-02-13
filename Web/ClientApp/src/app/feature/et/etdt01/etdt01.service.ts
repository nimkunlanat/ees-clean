import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etdt01Service {
  constructor(private http: HttpClient) { }
  list = (): Observable<any[]> => this.http.disableLoading().get<any[]>("etdt01/list")

  // detail = (ProvinceCode:Guid) => this.http.get<Province>('etdt01/detail', { params: { ProvinceCode : ProvinceCode.toString()} })

  // save = (data:Province) => this.http.post("etdt01/update", data);
}
