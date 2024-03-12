import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { District } from '@app/models/db/district';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Guid } from 'guid-typescript';
import { MenuItem } from 'primeng/api';
import { filter, switchMap } from 'rxjs';
import { Dbrt04Service, Master } from '../dbrt04.service';

@Component({
  selector: 'x-dbrt04-district',
  templateUrl: './dbrt04-district.component.html',
})
export class Dbrt04DistrictComponent {
  form: FormGroup;
  provinceForm: FormGroup;
  master: Master;
  Districts: District[] = [];
  provinceCode: Guid;
  districtCode: Guid;
  data: District;
  resetSearch: any = '';
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT04.ProgramName', routerLink: '/db/dbrt04' },
    {
      label: 'label.DBRT04.District',
      routerLink: '/db/dbrt04/district',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private sv: Dbrt04Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService,
    private router: Router,
  ) {
    this.createForm();
    this.activatedRoute.data.subscribe(({ dbrt04master, districts }) => {
      this.master = dbrt04master;
      if (districts) {
        this.Districts = districts.listDistrict;
        this.provinceCode = districts.provinceCode;
        this.districtCode = districts.districtCode;
        this.provinceForm.get('province').setValue(this.provinceCode);
      }
    });
  }

  createForm() {
    this.provinceForm = this.fb.group({
      province: [null],
    });
  }

  search(value?: string) {
    this.sv
    .listDistrict(value, this.provinceCode)
    .subscribe((Districts: District[]) => (this.Districts = Districts));
  }

  deleteDistrict(districtCode: Guid) {
    this.md
      .confirm('message.STD00015')
      .pipe(
        filter((confirm) => confirm),
        switchMap(() => this.sv.deleteDistrict(districtCode)))
      .subscribe(() => {
        this.resetSearch = '';
        this.search();
        this.ms.success('message.STD00016');
      });
  }
}
