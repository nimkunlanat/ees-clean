import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dbrt01Component } from './dbrt01/dbrt01.component';
import { statuses } from './dbrt01/dbrt01.resolver';

const routes: Routes = [
  { path: 'dbrt01', component: Dbrt01Component, title: 'Status', resolve: { statuses }, data: { code: 'dbrt01' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DbRoutingModule { }
