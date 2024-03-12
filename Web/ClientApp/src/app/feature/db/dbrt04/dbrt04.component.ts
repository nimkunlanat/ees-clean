import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { Dbrt04Service } from './dbrt04.service';
import { Province } from '@app/models/db/province';
import { Guid } from 'guid-typescript';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'x-dbrt04',
  templateUrl: './dbrt04.component.html'
})
export class Dbrt04Component {
  Provinces: Province[] = [];
  resetSearch: any = '';
  constructor(
    private sv: Dbrt04Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({provinces}) => this.Provinces = provinces)
  }

  search(value?: string) {
    this.sv.list(value).subscribe((Provinces: Province[]) => this.Provinces = Provinces)
  }
  delete(provinceCode: Guid) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(provinceCode)))
      .subscribe(() => {
        this.search()
        this.resetSearch = '';
        this.ms.success('message.STD00016');
      })
  }
}


