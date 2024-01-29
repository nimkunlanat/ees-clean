import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivate } from '@app/core/guard/core.guard';
import { Dbrt01DetailComponent } from './dbrt01/dbrt01-detail/dbrt01-detail.component';
import { Dbrt01Component } from './dbrt01/dbrt01.component';
import { detail, statuses } from './dbrt01/dbrt01.resolver';
import { Dbrt02Component } from './dbrt02/dbrt02.component';
import { Dbrt02DetailComponent } from './dbrt02/dbrt02-detail/dbrt02-detail.component';
import { dbrt02Detail, employees, master } from './dbrt02/dbrt02.resolver';
import { Dbrt03Component } from './dbrt03/dbrt03.component';
import { positions } from './dbrt03/dbrt03.resolver';

const routes: Routes = [
  { path: 'dbrt01', component: Dbrt01Component, title: 'Status', resolve: { statuses }, data: { code: 'dbrt01' } },
  { path: 'dbrt01/detail', component: Dbrt01DetailComponent, title: 'Status', resolve: { detail }, canDeactivate: [CanDeactivate], data: { code: 'dbrt01' } },
  { path: 'dbrt02', component: Dbrt02Component, title: 'Employee' , resolve: {employees} , data: { code: 'dbrt02' }},
  { path: 'dbrt02/detail', component: Dbrt02DetailComponent, title: 'Employee', resolve: { dbrt02Detail, master }, canDeactivate: [CanDeactivate], data: { code: 'dbrt02' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DbRoutingModule { }
