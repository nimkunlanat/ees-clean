import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Etdt02Component } from './etdt02/etdt02.component';
import { etdt02Resolver } from './etdt02/etdt02.resolver';
import { Etdt01Component } from './etdt01/etdt01.component';
import { Etdt01SkillComponent } from './etdt01/etdt01-skill/etdt01-skill.component';
import { Assessment, etdt01, etdt01SkillResolver} from './etdt01/etdt01.resolver';
import { Etrt05Component } from './etrt05/etrt05.component';
import { etrt05Resolver } from './etrt05/etrt05.resolver';
import { Etdt01AssessmentComponent } from './etdt01/etdt01-assessment/etdt01-assessment.component';


const routes: Routes = [
  { path: 'etrt05', component: Etrt05Component, title: 'Evaluation Form Management', resolve: { etrt05Resolver }, data: { code: 'etrt05' } },
  { path: 'etdt01', component: Etdt01Component, title: 'etdt01', resolve : {etdt01} , data : { code : 'etdt01'}},
  { path: 'etdt01/assessment', component: Etdt01AssessmentComponent, title: 'AssessmentForm', resolve : {Assessment} , data : { code : 'etdt01'}},
  { path: 'etdt01/assessment/skill', component: Etdt01SkillComponent, title: 'SkillForm', resolve : {etdt01SkillResolver} , data : { code : 'etdt01'}},
  { path: 'etdt02', component: Etdt02Component, title: 'Approve', resolve : {etdt02Resolver} ,data: { code: 'etdt02' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtRoutingModule { }
