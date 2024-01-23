import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn,  Router,  RouterStateSnapshot } from '@angular/router';
import { Province } from '@app/models/db/province';
import { Guid } from 'guid-typescript';
import { Dbrt04Service } from './dbrt04.service';

export const provinces: ResolveFn<Province[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt04Service).list()

export const detail: ResolveFn<Province> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { ProvinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { ProvinceCode: Guid } || { ProvinceCode: null }
  if (!ProvinceCode) {
    return null;
  }
  return inject(Dbrt04Service).detail(ProvinceCode)
}
