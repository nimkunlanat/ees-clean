import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TmRoutingModule } from './tm-routing.module';
import { Tmdt01Component } from './tmdt01/tmdt01.component';
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    Tmdt01Component,
  ],
  imports: [
    CommonModule,
    TmRoutingModule,
    SharedModule
  ]
})
export class TmModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('tm');
  }
}
