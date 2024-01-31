import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Position } from '@app/models/db/position';
import { Dbrt03Service } from './dbrt03.service';


export const positions: ResolveFn<Position[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt03Service).list()

export const dbrt03Detail: ResolveFn<Position> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { positionCode } = inject(Router).getCurrentNavigation()?.extras.state as { positionCode: String } || { positionCode: null }
  if (!positionCode) {
    return null;
  }
  return inject(Dbrt03Service).detail(positionCode)
}