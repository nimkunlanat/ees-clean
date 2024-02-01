import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Etdt02Component } from './etdt02/etdt02.component';
import { Dbrt01DetailComponent } from '../db/dbrt01/dbrt01-detail/dbrt01-detail.component';
import { CanDeactivate } from '@app/core/guard/core.guard';
import { etdt02Resolver } from './etdt02/etdt02.resolver';

const routes: Routes = [
  { path: 'etdt02', component: Etdt02Component, title: 'Approve', resolve : {etdt02Resolver} ,data: { code: 'etdt02' } },
  { path: 'etdt02/detail', component: Dbrt01DetailComponent, title: 'Approve', canDeactivate: [CanDeactivate], data: { code: 'Etbrt02' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtRoutingModule { }
