import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '@app/models/db/district';
import { Province } from '@app/models/db/province';
import { Guid } from 'guid-typescript';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';

export type Master = {
  province: SelectItem[];
}
@Injectable({
  providedIn: 'root'
})

export class Dbrt04Service {
  constructor(private http: HttpClient) { }

  list = (keywords:string = ""): Observable<Province[]> => this.http.disableLoading().get<Province[]>("dbrt04/list", { params: { keywords } })

  listDistrict = (keywords:string = "" , ProvinceCode:Guid) => this.http.disableLoading().get<District[]>("dbrt04/listDistrict", { params: { Keywords : keywords , ProvinceCode : ProvinceCode.toString()} })

  detail = (ProvinceCode:Guid) => this.http.get<Province>('dbrt04/detail', { params: { ProvinceCode : ProvinceCode.toString()} })

  detailDistrict = (DistrictCode:Guid , ProvinceCode:Guid) => this.http.get<District>('dbrt04/detailDistrict', { params: { DistrictCode : DistrictCode.toString(), ProvinceCode : ProvinceCode.toString()} })

  save = (data:Province) => this.http.post("dbrt04/update", data);

  saveDistrict = (data:District) => this.http.post("dbrt04/updateDistrict", data);

  delete = (ProvinceCode:Guid) => this.http.delete("dbrt04/delete", { params: { ProvinceCode :  ProvinceCode.toString()} })

  deleteDistrict = (DistrictCode:Guid) => this.http.delete("dbrt04/deleteDistrict", { params: { DistrictCode :  DistrictCode.toString()} })

  master = (ProvinceCode:Guid) => this.http.get<Master>('dbrt04/master',{ params: { ProvinceCode :  ProvinceCode.toString()} })
}

