import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtRoutingModule } from './et-routing.module';
import { Etrt05Component } from './etrt05/etrt05.component';


@NgModule({
  declarations: [
    Etrt05Component
  ],
  imports: [
    CommonModule,
    EtRoutingModule
  ]
})
export class EtModule { }
