import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn,  Router,  RouterStateSnapshot } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Province } from '@app/models/db/province';
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
  const { districtCode } = inject(Router).getCurrentNavigation()?.extras.state as { districtCode: Guid } || { districtCode: null }
  if(!provinceCode) return null;
  return forkJoin(of(provinceCode), of(districtCode) , inject(Dbrt04Service).listDistrict('' , provinceCode) ).pipe(map((res:any) => {
    let provinceCode = res[0];
    let districtCode = res[1];
    let listDistrict = res[2];
    return {provinceCode, districtCode , listDistrict}
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

export const subdistricts : ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { districtCode } = inject(Router).getCurrentNavigation()?.extras.state as { districtCode: Guid } || { districtCode: null }
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  if(!districtCode) return null;
  return forkJoin(of(districtCode),of(provinceCode) , inject(Dbrt04Service).listSubdistrict('' , districtCode,provinceCode)).pipe(map((res:any) => {
    let districtCode = res[0];
    let provinceCode = res[1];
    let listSubdistrict = res[2];
    return {districtCode, provinceCode, listSubdistrict}
  }))
}

export const dbrt04SubdistrictDetail : ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { districtCode } = inject(Router).getCurrentNavigation()?.extras.state as { districtCode: Guid } || { districtCode: null }
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  const { subdistrictCode } = inject(Router).getCurrentNavigation()?.extras.state as { subdistrictCode: Guid } || { subdistrictCode: null }
  if (!subdistrictCode && districtCode && provinceCode )
  return forkJoin(of(provinceCode),of(districtCode), inject(Dbrt04Service).master(provinceCode ,districtCode)).pipe(map((res:any) => {
    let provinceCode = res[0];
    let districtCode = res[1];
    return {provinceCode,districtCode,subdistrictCode}
  }))
  return inject(Dbrt04Service).detailSubdistrict(districtCode ,subdistrictCode)
}

export const master: ResolveFn<Master> = ()  => {
  const { provinceCode } = inject(Router).getCurrentNavigation()?.extras.state as { provinceCode: Guid } || { provinceCode: null }
  const { districtCode } = inject(Router).getCurrentNavigation()?.extras.state as { districtCode: Guid } || { districtCode: null }
  return inject(Dbrt04Service).master(provinceCode, districtCode);
}
