import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '@app/models/db/employee';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';



export class Master {
  positionCode: SelectItem[]
  gender: SelectItem[]
  nationality: SelectItem[]
  religion: SelectItem[]
}

@Injectable({
  providedIn: 'root'
})
export class Dbrt02Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<Employee[]> => this.http.disableLoading().get<Employee[]>("dbrt02/list", { params: { keywords } })

  delete = (employeeCode: any) => this.http.delete("dbrt02/delete", { params: { employeeCode } })

  detail = (employeeCode: any) => this.http.get<Employee>('dbrt02/detail', { params: { employeeCode } })

  save = (data: any) => this.http.post("dbrt02/update", data);

  master = () => this.http.get<Master>('dbrt02/master')
}
