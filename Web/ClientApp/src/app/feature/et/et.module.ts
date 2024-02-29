import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtRoutingModule } from './et-routing.module';
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';
import { Etrt05Component } from './etrt05/etrt05.component';
import { Etdt02Component } from './etdt02/etdt02.component';
import { SharedModule } from '@app/shared/shared.module';
import { Etdt01Component } from './etdt01/etdt01.component';
import { Etdt01SkillComponent } from './etdt01/etdt01-skill/etdt01-skill.component';
import { Etdt01AssessmentComponent } from './etdt01/etdt01-assessment/etdt01-assessment.component';
import { Etdt02DocumentComponent } from './etdt02/etdt02-document/etdt02-document.component';
import { Etrt05DetailComponent } from './etrt05/etrt05-detail/etrt05-detail.component';
import { Etrt06Component } from './etrt06/etrt06.component';


@NgModule({
  declarations: [
    Etdt01Component,
    Etdt01SkillComponent,
    Etdt01AssessmentComponent,
    Etdt02Component,
    Etdt02DocumentComponent,
    Etrt05Component,
    Etrt05DetailComponent,
    Etrt06Component
  ],
  imports: [
    CommonModule,
    EtRoutingModule,
    SharedModule
  ]
})

export class EtModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('et');
  }
}
