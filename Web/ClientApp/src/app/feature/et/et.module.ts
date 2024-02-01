import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtRoutingModule } from './et-routing.module';
import { Etrt05Component } from './etrt05/etrt05.component';
import { Etdt02Component } from './etdt02/etdt02.component';
import { SharedModule } from "../../shared/shared.module";
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';


@NgModule({
    declarations: [
        Etrt05Component,
        Etdt02Component,
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
