import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Province } from '@app/models/db/province';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dbrt04Service {
  constructor(private http: HttpClient) { }

  list = (keywords:string = ""): Observable<Province[]> => this.http.disableLoading().get<Province[]>("dbrt04/list", { params: { keywords } })

  detail = (ProvinceCode:Guid) => this.http.get<Province>('dbrt04/detail', { params: { ProvinceCode : ProvinceCode.toString()} })

  save = (data:Province) => this.http.post("dbrt04/update", data);

  delete = (ProvinceCode:Guid) => this.http.delete("dbrt04/delete", { params: { ProvinceCode :  ProvinceCode.toString()} })

}
