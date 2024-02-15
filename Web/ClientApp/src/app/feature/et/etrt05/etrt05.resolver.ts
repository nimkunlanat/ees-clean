import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Etrt05Service } from './etrt05.service';
import { inject } from '@angular/core';
import { EvaluateGroup } from '@app/models/et/evaluateGroup';
import { EvaluateForm } from '@app/models/et/evaluateForm';
import { Observable, forkJoin, map, of, zip } from 'rxjs';
import { EvaluateDetail } from '@app/models/et/evaluateDetail';



export const roleList: ResolveFn<EvaluateForm[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(Etrt05Service).list()

export const evaluationList: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const { roleCode } = inject(Router).getCurrentNavigation()?.extras.state as { roleCode: string } || { roleCode: null }

    return forkJoin(inject(Etrt05Service).evaluation('', roleCode), of(roleCode)).pipe(map((res: any) => {
        let list = res[0]
        let params = res[1]
        return { list, params }
    }))
}

export const evaluationDetail: ResolveFn<Observable<{ detail: EvaluateDetail[], roleCode: string }>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const { evaluateGroupCode, roleCode } = inject(Router).getCurrentNavigation()?.extras.state as { evaluateGroupCode: string, roleCode: string } || { evaluateGroupCode: null, roleCode: null }
    const router = inject(Router)

    if (!roleCode) router.navigate(["et/etrt05"], { replaceUrl: true })


    return zip(inject(Etrt05Service).detail(evaluateGroupCode), of(roleCode)).pipe(map((res: any) => {
        return { detail: res[0], roleCode: res[1] }
    }))
}