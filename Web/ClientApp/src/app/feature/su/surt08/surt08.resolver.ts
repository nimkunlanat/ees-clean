import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { ActivityLog } from '@app/models/su/activityLog';
import { inject } from '@angular/core';
import { Surt08Service } from './surt08.service';
import { map } from 'rxjs';

export const activityLogs: ResolveFn<ActivityLog[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(Surt08Service).list().pipe(map((activityLogs: ActivityLog[]) => {
    return activityLogs.map(m => {
      if (["2001", "2002", "2003", "2004", "2005", "5000"].includes(m.activityTypeCode)) {
        m.logMessage = JSON.parse(m.logMessage)
      }

      return m
    })
  }))
};