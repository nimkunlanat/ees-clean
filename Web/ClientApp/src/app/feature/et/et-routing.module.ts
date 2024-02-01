import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Etdt01Component } from './etdt01/etdt01.component';
import { Etdt01SkillComponent } from './etdt01/etdt01-skill/etdt01-skill.component';
import { etdt01Resolver, etdt01SkillResolver} from './etdt01/etdt01.resolver';

const routes: Routes = [
  { path: 'etrt05', component: Etrt05Component, title: 'Evaluation Form Management', resolve: { etrt05Resolver }, data: { code: 'etrt05' } },
  { path: 'etdt01', component: Etdt01Component, title: 'AssessmentForm', resolve : {etdt01Resolver} , data : { code : 'etdt01'}},
  { path: 'etdt01/etdt01-skill', component: Etdt01SkillComponent, title: 'SkillForm', resolve : {etdt01SkillResolver} , data : { code : 'etdt01'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtRoutingModule { }
