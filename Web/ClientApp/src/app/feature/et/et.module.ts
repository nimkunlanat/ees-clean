import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtRoutingModule } from './et-routing.module';
import { Etrt05Component } from './etrt05/etrt05.component';
import { Etrt01Component } from './etrt01/etrt01.component';


@NgModule({
  declarations: [
    Etrt05Component,
    Etrt01Component
  ],
  imports: [
    CommonModule,
    EtRoutingModule
  ]
})
export class EtModule { }
