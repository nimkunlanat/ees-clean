import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { SkillMatrixGroup } from '@app/models/et/skillMatrixGroup';
import { Etrt06Service } from './etrt06.service';
import { Guid } from 'guid-typescript';
import { map } from 'rxjs';

export const etrt06Resolver : ResolveFn<SkillMatrixGroup[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etrt06Service).list()

export const skillMatrixGroup: ResolveFn<SkillMatrixGroup> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const { groupId } = inject(Router).getCurrentNavigation()?.extras.state as { groupId: Guid } || { groupId: null }

    return groupId ? inject(Etrt06Service).detail(groupId) : null
  }
