import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from '@app/models/su/menu';
import { RowState } from '@app/shared/types/data.types';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';

export class MenuDTO extends Menu {
  menuNameTH: string;
  menuNameEN: string;
  menuName: string;
}

export type Master = {
  mainMenu: SelectItem[];
  programCode: SelectItem[];
}

@Injectable({
  providedIn: 'root'
})
export class Surt02Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<MenuDTO[]> => this.http.disableLoading().get<MenuDTO[]>("surt02/list", { params: { keywords } })

  detail = (menuCode: string) => this.http.get<MenuDTO>('surt02/detail', { params: { menuCode } })

  master = () => this.http.get<Master>('surt02/master')

  save = (data: MenuDTO) => {
    if (data.rowState == RowState.Add) return this.http.post("surt02/create", data);
    else return this.http.put("surt02/update", data);
  }

  delete = (menuCode: string) => this.http.delete("surt02/delete", { params: { menuCode } })
}
