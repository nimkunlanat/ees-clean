import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { District } from '@app/models/db/district';
import { Province } from '@app/models/db/province';
import { Subdistrict } from '@app/models/db/subdistrict';
import { Guid } from 'guid-typescript';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';

export type Master = {
  province: SelectItem[];
  district: SelectItem[];
}
@Injectable({
  providedIn: 'root'
})

export class Dbrt04Service {
  constructor(private http: HttpClient) { }

  list = (keywords:string = ""): Observable<Province[]> => this.http.disableLoading().get<Province[]>("dbrt04/list", { params: { keywords } })

  listDistrict = (keywords:string = "" , ProvinceCode:Guid) => this.http.disableLoading().get<District[]>("dbrt04/listDistrict", { params: { Keywords : keywords , ProvinceCode : ProvinceCode.toString()} })

  listSubdistrict = (keywords:string = "" , DistrictCode:Guid , ProvinceCode:Guid) => this.http.disableLoading().get<Subdistrict[]>("dbrt04/listSubdistrict", { params: { Keywords : keywords , DistrictCode : DistrictCode.toString(), ProvinceCode : ProvinceCode.toString()} })

  detail = (ProvinceCode:Guid) => this.http.get<Province>('dbrt04/detail', { params: { ProvinceCode : ProvinceCode.toString()} })

  detailDistrict = (DistrictCode:Guid , ProvinceCode:Guid) => this.http.get<District>('dbrt04/detailDistrict', { params: { DistrictCode : DistrictCode.toString(), ProvinceCode : ProvinceCode.toString()}})

  detailSubdistrict = (DistrictCode:Guid , SubdistrictCode:Guid) => this.http.get<Subdistrict>('dbrt04/detailSubdistrict', { params: {DistrictCode : DistrictCode.toString(), SubdistrictCode : SubdistrictCode.toString()} })

  save = (data:Province) => this.http.post("dbrt04/update", data);

  saveDistrict = (data:District) => this.http.post("dbrt04/updateDistrict", data);

  saveSubdistrict = (data:Subdistrict) => this.http.post("dbrt04/updateSubdistrict", data);

  delete = (ProvinceCode:Guid) => this.http.delete("dbrt04/delete", { params: { ProvinceCode :  ProvinceCode.toString()} })

  deleteDistrict = (DistrictCode:Guid) => this.http.delete("dbrt04/deleteDistrict", { params: { DistrictCode :  DistrictCode.toString()} })

  deleteSubdistrict = (SubdistrictCode:Guid) => this.http.delete("dbrt04/deleteSubdistrict", { params: { SubdistrictCode :  SubdistrictCode.toString()} })

  master = (ProvinceCode:Guid, DistrictCode?:Guid) => this.http.get<Master>('dbrt04/master',{ params: { ProvinceCode : ProvinceCode != null ? ProvinceCode.toString() : '', DistrictCode : DistrictCode != null ? DistrictCode.toString() : ''} })
}

