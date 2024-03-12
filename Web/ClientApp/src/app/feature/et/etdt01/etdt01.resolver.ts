import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { Etdt01Service } from './etdt01.service';

export const etdt01: ResolveFn<boolean> = (route, state) => {
  return true;
};

export const Assessment: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let params:any = inject(Router).getCurrentNavigation()?.extras.state;
  let listAssessment = inject(Etdt01Service).listAssessment()
  return forkJoin(listAssessment).pipe(map((res) => {
    let listAssessment = res[0];
    return {listAssessment , params}
  }))
}

export const Skillmatrix: ResolveFn<any[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etdt01Service).listSkillmatrix()
