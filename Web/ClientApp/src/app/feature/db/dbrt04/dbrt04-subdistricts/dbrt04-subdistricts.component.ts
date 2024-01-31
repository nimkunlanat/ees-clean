import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { Subdistrict } from '@app/models/db/subdistrict';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Guid } from 'guid-typescript';
import { MenuItem } from 'primeng/api';
import { filter, switchMap } from 'rxjs';
import { Dbrt04Service, Master } from '../dbrt04.service';

@Component({
  selector: 'x-dbrt04-subdistricts',
  templateUrl: './dbrt04-subdistricts.component.html',
})
export class Dbrt04SubdistrictsComponent {
  form: FormGroup;
  provinceForm: FormGroup;
  master: Master;
  Subdistricts: Subdistrict[] = [];
  provinceCode: Guid;
  districtCode: Guid;
  data: Subdistrict;
  resetSearch = '';
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT04.ProgramName', routerLink: '/db/dbrt04' },
    { label: 'label.DBRT04.District',routerLink: '/db/dbrt04/dbrt04-district'},
    { label: 'label.DBRT04.Subdistrict',routerLink: '/db/dbrt04/dbrt04-district/dbrt04-subdistricts'},
  ];
  constructor(
    private fb: FormBuilder,
    private sv: Dbrt04Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService
  ) {
    this.createForm();
    this.activatedRoute.data.subscribe(({ dbrt04master, subdistricts }) => {
      this.master = dbrt04master;
      this.provinceCode = subdistricts.provinceCode
      this.districtCode = subdistricts.districtCode

      this.breadcrumbItems.map(m => {
        if(m.routerLink === '/db/dbrt04/dbrt04-district') m.state = {districtCode : this.districtCode , provinceCode : this.provinceCode}
        })
      this.provinceForm.get('province').setValue(this.provinceCode);
      this.provinceForm.get('district').setValue(this.districtCode);
      if (subdistricts) {
        this.Subdistricts = subdistricts.listSubdistrict;
        this.districtCode = subdistricts.districtCode;
      }
    });
  }

  createForm() {
    this.provinceForm = this.fb.group({
      province: [null],
      district: [null],
    });
  }

  search(value: string = '') {
    this.sv
      .listSubdistrict(value, this.districtCode, this.provinceCode)
      .subscribe((Subdistricts: Subdistrict[]) => (this.Subdistricts = Subdistricts));
  }

  deleteSubdistrict(subdistrictCode: Guid) {
    this.md
      .confirm('message.STD00015')
      .pipe(
        filter((confirm) => confirm),
        switchMap(() => this.sv.deleteSubdistrict(subdistrictCode))
      )
      .subscribe(() => {
        this.search();
        this.resetSearch = '';
        this.ms.success('message.STD00016');
      });
  }
}
