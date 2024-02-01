import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtRoutingModule } from './et-routing.module';
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';
import { SharedModule } from '@app/shared/shared.module';
import { Etrt05Component } from './etrt05/etrt05.component';


@NgModule({
  declarations: [
    Etrt05Component
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
