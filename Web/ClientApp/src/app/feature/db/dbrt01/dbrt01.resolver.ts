import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn,  RouterStateSnapshot } from '@angular/router';
import { Status } from '@app/models/db/status';
import { Dbrt01Service } from './dbrt01.service';

export const statuses: ResolveFn<Status[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt01Service).list()


