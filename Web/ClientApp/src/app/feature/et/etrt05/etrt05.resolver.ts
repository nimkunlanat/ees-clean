import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Etrt05Service } from './etrt05.service';
import { inject } from '@angular/core';
import { EvaluationGroup } from '@app/models/et/evaluationGroup';


export const etrt05Resolver : ResolveFn<EvaluationGroup[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etrt05Service).list()

export const evaluationGroup: ResolveFn<EvaluationGroup> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const { evaluateGroupCode } = inject(Router).getCurrentNavigation()?.extras.state as { evaluateGroupCode: string } || { evaluateGroupCode: null }
  
    return inject(Etrt05Service).detail(evaluateGroupCode)
  }