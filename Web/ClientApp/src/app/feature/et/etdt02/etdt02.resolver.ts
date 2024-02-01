import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Approve } from '@app/models/et/approve';
import { Etdt02Service } from './etdt02.service';


export const etdt02Resolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
