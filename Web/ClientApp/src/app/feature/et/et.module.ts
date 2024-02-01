import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtRoutingModule } from './et-routing.module';
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';
import { Etrt05Component } from './etrt05/etrt05.component';
import { SharedModule } from '@app/shared/shared.module';
import { Etdt01Component } from './etdt01/etdt01.component';
import { Etdt01SkillComponent } from './etdt01/etdt01-skill/etdt01-skill.component';



@NgModule({
  declarations: [
    Etrt05Component,
    Etdt01Component,
    Etdt01SkillComponent
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