import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Status } from '@app/models/db/status';
import { Guid } from 'guid-typescript';
import { Dbrt01Service } from './dbrt01.service';

export const statuses: ResolveFn<Status[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt01Service).list()

export const detail: ResolveFn<Status> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { id } = inject(Router).getCurrentNavigation()?.extras.state as { id: Guid } || { id: null }
  if (!id) {
    return null;
  }
  return inject(Dbrt01Service).detail(id)
}
