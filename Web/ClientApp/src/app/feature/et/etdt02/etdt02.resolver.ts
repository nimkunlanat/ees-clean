import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Approve } from '@app/models/et/approve';
import { Etdt02Service } from './etdt02.service';

export const Approves: ResolveFn<Approve[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const { assessment } = inject(Router).getCurrentNavigation()?.extras.state as { assessment: string} || { assessment: null }

    return inject(Etdt02Service).list(null , assessment)
}

export const documentApproves: ResolveFn<Approve[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etdt02Service).document()