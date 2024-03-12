import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { SkillMatrixGroup } from '@app/models/et/skillMatrixGroup';
import { Etrt06Service } from './etrt06.service';
import { Guid } from 'guid-typescript';
import { Observable, forkJoin, map, of, zip } from 'rxjs';
import { SkillMatrixSubject } from '@app/models/et/skillMatrixSubject';
import { SkillMatrixGrade } from '@app/models/et/skillMatrixGrade';

export const etrt06Resolver: ResolveFn<SkillMatrixGroup[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etrt06Service).list()

export const skillMatrixGroup: ResolveFn<{detail?:SkillMatrixGrade , params: Guid}> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { groupId } = inject(Router).getCurrentNavigation()?.extras.state as { groupId: Guid } || { groupId: null }
  let detail = groupId ? inject(Etrt06Service).detail(groupId) : of(null)
  return forkJoin(detail , of(groupId)).pipe(map((res: any) => {
    let detail = res[0]
    let params = res[1]
    return {  detail , params }

}))
}

export const skillMatrixGrade : ResolveFn<Observable<{grade?:SkillMatrixGrade[] , params: Guid}>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { subjectId , groupId} = inject(Router).getCurrentNavigation()?.extras.state as { subjectId: Guid , groupId:Guid } || { subjectId: null , groupId:null}
  let grade = subjectId ? inject(Etrt06Service).grade(subjectId) : of(null)
  return forkJoin(grade , of(groupId)).pipe(map((res: any) => {
    let grade = res[0]
    let params = res[1]
    return { grade, params }
}))
}


