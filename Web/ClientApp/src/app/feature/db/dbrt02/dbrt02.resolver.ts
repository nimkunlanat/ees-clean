import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Employee } from '@app/models/db/employee';
import { Dbrt02Service, Master } from './dbrt02.service';

export const employees: ResolveFn<Employee[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt02Service).list()

export const dbrt02Detail: ResolveFn<Employee> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const { employeeCode } = inject(Router).getCurrentNavigation()?.extras.state as { employeeCode: String } || { employeeCode: null }
  if (!employeeCode) {
    return null;
  }
  return inject(Dbrt02Service).detail(employeeCode)
}
export const dbrt02master: ResolveFn<Master> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Dbrt02Service).master()
