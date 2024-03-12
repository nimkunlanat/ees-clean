import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Etdt02Component } from './etdt02/etdt02.component';
import { Approves, documentApproves } from './etdt02/etdt02.resolver';
import { Etdt01Component } from './etdt01/etdt01.component';
import { Etdt01SkillComponent } from './etdt01/etdt01-skill/etdt01-skill.component';
import { Assessment, etdt01, Skillmatrix} from './etdt01/etdt01.resolver';
import { Etrt05Component } from './etrt05/etrt05.component';
import { Etdt02DocumentComponent } from './etdt02/etdt02-document/etdt02-document.component';
import { roleList, evaluationList, evaluationDetail } from './etrt05/etrt05.resolver';
import { Etrt05DetailComponent } from './etrt05/etrt05-detail/etrt05-detail.component';
import { Etrt06Component } from './etrt06/etrt06.component';
import { Etdt01AssessmentComponent } from './etdt01/etdt01-assessment/etdt01-assessment.component';
import { etrt06Resolver, skillMatrixGrade, skillMatrixGroup } from './etrt06/etrt06.resolver';
import { Etrt06DetailComponent } from './etrt06/etrt06-detail/etrt06-detail.component';
import { Etrt05EvaluationComponent } from './etrt05/etrt05-evaluation/etrt05-evaluation.component';
import { Etrt06GradeComponent } from './etrt06/etrt06-grade/etrt06-grade.component';


const routes: Routes = [
  { path: 'etdt01', component: Etdt01Component, title: 'etdt01', resolve : {etdt01} , data : { code : 'etdt01'}},
  { path: 'etdt01/assessment', component: Etdt01AssessmentComponent, title: 'AssessmentForm', resolve : {Assessment} , data : { code : 'etdt01'}},
  { path: 'etdt01/assessment/skill', component: Etdt01SkillComponent, title: 'SkillForm', resolve : {Skillmatrix} , data : { code : 'etdt01'}},
  { path: 'etdt02', component: Etdt02Component, title: 'Approve', resolve : {Approves, documentApproves} ,data: { code: 'etdt02' } },
  { path: 'etdt02/etdt02-document', component: Etdt02DocumentComponent, title: 'Approve', resolve : {Approves} , data : { code : 'etdt02'}},
  { path: 'etrt05', component: Etrt05Component, title: 'Evaluation Form Management', resolve: { roleList }, data: { code: 'etrt05' } },
  { path: 'etrt05/evaluation', component: Etrt05EvaluationComponent, title: 'Evaluation Form Management', resolve: { evaluationList ,roleList }, data: { code: 'etrt05' } },
  { path: 'etrt05/evaluation/detail', component: Etrt05DetailComponent, title: 'Evaluation Form Management', resolve : { evaluationDetail }, data: { code: 'etrt05' } },
  { path: 'etrt06', component: Etrt06Component, title: 'Skill Matrix Management', resolve: { etrt06Resolver }, data: { code: 'etrt06' } },
  { path: 'etrt06/detail', component: Etrt06DetailComponent, title: 'Skill Matrix Management', resolve: { etrt06Resolver, skillMatrixGroup }, data: { code: 'etrt06' } },
  { path: 'etrt06/detail/grade', component: Etrt06GradeComponent, title: 'Skill Matrix Management',resolve: {skillMatrixGrade }, data: { code: 'etrt06' } } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtRoutingModule { }
