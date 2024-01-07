import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Master, MenuDTO, Surt02Service } from './surt02.service';
import { inject } from '@angular/core';

export const menus: ResolveFn<MenuDTO[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Surt02Service).list()

export const menu: ResolveFn<MenuDTO> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { menuCode } = inject(Router).getCurrentNavigation()?.extras.state as { menuCode: string } || { menuCode: null }

  return inject(Surt02Service).detail(menuCode)
}

export const master: ResolveFn<Master> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Surt02Service).master()