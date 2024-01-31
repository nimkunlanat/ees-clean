import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DbRoutingModule } from './db-routing.module';
import { Dbrt01Component } from './dbrt01/dbrt01.component';
import { LazyTranslationService } from '@app/core/services/lazy-translation.service';
import { SharedModule } from '@app/shared/shared.module';
import { Dbrt01DetailComponent } from './dbrt01/dbrt01-detail/dbrt01-detail.component';
import { Dbrt04Component } from './dbrt04/dbrt04.component';
import { Dbrt04DetailComponent } from './dbrt04/dbrt04-detail/dbrt04-detail.component';
import { Dbrt04DistrictComponent } from './dbrt04/dbrt04-district/dbrt04-district.component';
import { Dbrt04DistrictDetailComponent } from './dbrt04/dbrt04-district/dbrt04-district-detail/dbrt04-district-detail.component';
import { Dbrt04SubdistrictsComponent } from './dbrt04/dbrt04-subdistricts/dbrt04-subdistricts.component';
import { Dbrt04SubdistrictsDetailComponent } from './dbrt04/dbrt04-subdistricts/dbrt04-subdistricts-detail/dbrt04-subdistricts-detail.component';


@NgModule({
  declarations: [
    Dbrt01Component,
    Dbrt01DetailComponent,
    Dbrt04Component,
    Dbrt04DetailComponent,
    Dbrt04DistrictComponent,
    Dbrt04DistrictDetailComponent,
    Dbrt04SubdistrictsComponent,
    Dbrt04SubdistrictsDetailComponent
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
