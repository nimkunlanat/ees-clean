import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn,  Router,  RouterStateSnapshot } from '@angular/router';
import { Province } from '@app/models/db/province';
import { Guid } from 'guid-typescript';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Dbrt04Service, Master } from './dbrt04.service';

export const provinces: ResolveFn<Province[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt04Service).list()

export const dbrt04Detail: ResolveFn<Province> = () => {
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  if(!provinceCode) return null;
  return inject(Dbrt04Service).detail(provinceCode)
}

export const districts : ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  if(!provinceCode) return null;
  return forkJoin(of(provinceCode) , inject(Dbrt04Service).listDistrict('' , provinceCode) ).pipe(map((res:any) => {
    let provinceCode = res[0];
    let listDistrict = res[1];
    return {provinceCode , listDistrict}
  }))
}

export const dbrt04DistrictDetail: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { districtCode } = inject(Router).getCurrentNavigation()?.extras.state as { districtCode: Guid } || { districtCode: null }
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  if (!districtCode && provinceCode)
  return forkJoin(of(provinceCode), inject(Dbrt04Service).master(provinceCode)).pipe(map((res:any) => {
    let provinceCode = res[0];
    let master = res[1];
    return {provinceCode,master}
  }))
  return inject(Dbrt04Service).detailDistrict(districtCode ,provinceCode)
}

export const master: ResolveFn<Master> = ()  => {
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  return inject(Dbrt04Service).master(provinceCode);
}
