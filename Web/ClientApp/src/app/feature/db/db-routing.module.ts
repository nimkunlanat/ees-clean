import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivate } from '@app/core/guard/core.guard';
import { Dbrt01DetailComponent } from './dbrt01/dbrt01-detail/dbrt01-detail.component';
import { Dbrt01Component } from './dbrt01/dbrt01.component';
import { Dbrt04DetailComponent } from './dbrt04/dbrt04-detail/dbrt04-detail.component';
import { detail, statuses } from './dbrt01/dbrt01.resolver';
import { Dbrt02Component } from './dbrt02/dbrt02.component';
import { Dbrt02DetailComponent } from './dbrt02/dbrt02-detail/dbrt02-detail.component';
import { dbrt02Detail, employees, master } from './dbrt02/dbrt02.resolver';
import { Dbrt03Component } from './dbrt03/dbrt03.component';
import { dbrt03Detail, positions } from './dbrt03/dbrt03.resolver';
import { Dbrt03DetailComponent } from './dbrt03/dbrt03-detail/dbrt03-detail.component';
import { Dbrt04Component} from './dbrt04/dbrt04.component';
import { provinces , districts, master, subdistricts } from './dbrt04/dbrt04.resolver';
import { dbrt04Detail ,dbrt04DistrictDetail ,dbrt04SubdistrictDetail } from './dbrt04/dbrt04.resolver';
import { Dbrt04DistrictComponent } from './dbrt04/dbrt04-district/dbrt04-district.component';
import { Dbrt04DistrictDetailComponent } from './dbrt04/dbrt04-district/dbrt04-district-detail/dbrt04-district-detail.component';
import { Dbrt04SubdistrictsComponent } from './dbrt04/dbrt04-subdistricts/dbrt04-subdistricts.component';
import { Dbrt04SubdistrictsDetailComponent } from './dbrt04/dbrt04-subdistricts/dbrt04-subdistricts-detail/dbrt04-subdistricts-detail.component';

const routes: Routes = [
  { path: 'dbrt01', component: Dbrt01Component, title: 'Status', resolve: { statuses }, data: { code: 'dbrt01' } },
  { path: 'dbrt01/detail', component: Dbrt01DetailComponent, title: 'Status', resolve: { detail }, canDeactivate: [CanDeactivate], data: { code: 'dbrt01' } },
  { path: 'dbrt02', component: Dbrt02Component, title: 'Employee' , resolve: {employees} , data: { code: 'dbrt02' }},
  { path: 'dbrt02/detail', component: Dbrt02DetailComponent, title: 'Employee', resolve: { dbrt02Detail, master }, canDeactivate: [CanDeactivate], data: { code: 'dbrt02' } },
  { path: 'dbrt03', component: Dbrt03Component, title: 'Position' , resolve: {positions} , data: { code: 'dbrt03' }},
  { path: 'dbrt03/detail', component: Dbrt03DetailComponent, title: 'Position', resolve: { dbrt03Detail }, canDeactivate: [CanDeactivate], data: { code: 'dbrt03' } },
  { path: 'dbrt04', component: Dbrt04Component, title: 'Province', resolve: { provinces }, data: { code: 'dbrt04' }},
  { path: 'dbrt04/detail', component: Dbrt04DetailComponent, title: 'Province', resolve: { dbrt04Detail }, canDeactivate: [CanDeactivate], data: { code: 'dbrt04' } },
  { path: 'dbrt04/dbrt04-district', component: Dbrt04DistrictComponent, title: 'District', resolve: { districts , master}, data: { code: 'dbrt04' }},
  { path: 'dbrt04/dbrt04-district/dbrt04-district-detail', component: Dbrt04DistrictDetailComponent, title: 'District', resolve: { dbrt04DistrictDetail  , master}, canDeactivate: [CanDeactivate], data: { code: 'dbrt04' } },
  { path: 'dbrt04/dbrt04-district/dbrt04-subdistricts', component: Dbrt04SubdistrictsComponent, title: 'Subdistrict', resolve: { subdistricts ,master }, data: { code: 'dbrt04' }},
  { path: 'dbrt04/dbrt04-district/dbrt04-subdistricts/dbrt04-subdistricts-detail', component: Dbrt04SubdistrictsDetailComponent, title: 'Subdistrict', resolve: { dbrt04SubdistrictDetail  , master}, canDeactivate: [CanDeactivate], data: { code: 'dbrt04' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DbRoutingModule { }
