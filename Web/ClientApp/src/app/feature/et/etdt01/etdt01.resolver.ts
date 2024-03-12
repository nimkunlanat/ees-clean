import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { DocumentApproved } from '@app/models/et/documentApproved';
import { forkJoin, map, of } from 'rxjs';
import { Etdt01Service, Master } from './etdt01.service';

export const etdt01: ResolveFn<boolean> = (route, state) => {
  return true;
};

export const DocumentApproveds: ResolveFn<DocumentApproved[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etdt01Service).list()

export const Assessment: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let params: any = inject(Router).getCurrentNavigation()?.extras.state;
  let documentNo = params?.documentNo;
  let listAssessment = inject(Etdt01Service).listAssessment(documentNo);
  return forkJoin(listAssessment).pipe(map((res) => {
    let listAssessment = res[0];
    return { listAssessment, params };
  }))
}

// export const Skillmatrix: ResolveFn<any[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etdt01Service).listSkillmatrix()

export const Skillmatrix: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let params: any = inject(Router).getCurrentNavigation()?.extras.state;
  let documentNo = params?.documentNo;
  let listSkillmatrix = inject(Etdt01Service).listSkillmatrix(documentNo);
  return forkJoin(listSkillmatrix).pipe(map((res) => {
    let listSkillmatrix = res[0];
    return { listSkillmatrix, params };
  }))
}



export const etdt01master: ResolveFn<Master> = () => {
  return inject(Etdt01Service).master();
}
