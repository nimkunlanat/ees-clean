import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DbRoutingModule } from './db-routing.module';
import { Dbrt01Component } from './dbrt01/dbrt01.component';
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    Dbrt01Component
  ],
  imports: [
    CommonModule,
    DbRoutingModule,
    SharedModule
  ]
})
export class DbModule {
  constructor(private lazy: LazyTranslationService) {
    lazy.add('db');
  }
}
