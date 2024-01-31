import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from '@app/models/db/position';
import { RowState } from '@app/shared/types/data.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dbrt03Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<Position[]> => this.http.disableLoading().get<Position[]>("dbrt03/list", { params: { keywords } })

  delete = (positionCode: any) => this.http.delete("dbrt03/delete", { params: { positionCode } })

  detail = (positionCode: any) => this.http.get<Position>('dbrt03/detail', { params: { positionCode } })

  save = (data: any) => this.http.post("dbrt03/update", data);
}
