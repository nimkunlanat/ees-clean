import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SkillMatrixGrade } from '@app/models/et/skillMatrixGrade';
import { SkillMatrixGroup } from '@app/models/et/skillMatrixGroup';
import { SkillMatrixSubject } from '@app/models/et/skillMatrixSubject';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Etrt06Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<SkillMatrixGroup[]> => this.http.disableLoading().get<SkillMatrixGroup[]>("etrt06/list", { params: { keywords } })

  delete = (groupName: any) => this.http.delete("etrt06/delete", { params: { groupName } })

  detail = (groupId: any): Observable<SkillMatrixGroup> => this.http.get<SkillMatrixGroup>("etrt06/detail", { params: { groupId}})

  saveForm = (data) => this.http.post("etrt06/saveForm", data);

  grade = (subjectId: any = ""): Observable<SkillMatrixGroup> => this.http.get<SkillMatrixGroup>("etrt06/grade", { params: { subjectId : subjectId } })

  saveGrade = (data) => this.http.post("etrt06/saveGrade", data);
}
