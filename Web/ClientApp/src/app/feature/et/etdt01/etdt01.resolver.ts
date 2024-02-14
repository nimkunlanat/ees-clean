import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Etdt01Service } from './etdt01.service';

export const etdt01: ResolveFn<boolean> = (route, state) => {
  return true;
};

export const Assessment: ResolveFn<any[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etdt01Service).list()

export const etdt01SkillResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
