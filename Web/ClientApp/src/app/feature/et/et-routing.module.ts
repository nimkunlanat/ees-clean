import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Etrt05Component } from './etrt05/etrt05.component';
import { etrt05Resolver } from './etrt05/etrt05.resolver';

const routes: Routes = [
  { path: 'dbrt01', component: Etrt05Component, title: 'Status', resolve: { etrt05Resolver }, data: { code: 'etert05' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtRoutingModule { }
