import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SkillMatrixGroup } from '@app/models/et/skillMatrixGroup';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etrt06Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<SkillMatrixGroup[]> => this.http.disableLoading().get<SkillMatrixGroup[]>("etrt06/list", { params: { keywords } })

  delete = (groupName: any) => this.http.delete("etrt06/delete", { params: { groupName } })

  detail = (groupId: any): Observable<SkillMatrixGroup> => this.http.get<SkillMatrixGroup>("etrt06/detail", { params: { groupId } })
}
