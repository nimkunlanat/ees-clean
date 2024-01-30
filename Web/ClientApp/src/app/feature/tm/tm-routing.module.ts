import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tmdt01Component } from './tmdt01/tmdt01.component';
import { list, saveList } from './tmdt01/tmdt01.resolver';

const routes: Routes = [
  {path: 'tmdt01' , title: 'Team Management' , component: Tmdt01Component , resolve : {list , saveList} , data: { code: 'tmdt01' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TmRoutingModule { }
