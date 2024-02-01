import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { teamManagement } from '@app/models/tm/teamManagement';
import { Tmdt01Service } from './tmdt01.service';


export const list: ResolveFn<any> = (route, state) => {
  return inject(Tmdt01Service).list();
};

export const saveList: ResolveFn<any> = (route, state) => {
  return inject(Tmdt01Service).saveList();
};