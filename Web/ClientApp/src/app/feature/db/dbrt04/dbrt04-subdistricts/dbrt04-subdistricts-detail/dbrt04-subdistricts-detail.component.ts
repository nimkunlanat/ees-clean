import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { Subdistrict } from '@app/models/db/subdistrict';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { Guid } from 'guid-typescript';
import { MenuItem } from 'primeng/api';
import { Observable, of, switchMap } from 'rxjs';
import { Dbrt04Service, Master } from '../../dbrt04.service';

@Component({
  selector: 'x-dbrt04-subdistricts-detail',
  templateUrl: './dbrt04-subdistricts-detail.component.html'
})
export class Dbrt04SubdistrictsDetailComponent {
  form: FormGroup;
  data: Subdistrict;
  master: Master;
  provinceCode:Guid;
  districtCode: Guid;
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT04.ProgramName', routerLink: '/db/dbrt04' },
    { label: 'label.DBRT04.District', routerLink: '/db/dbrt04/district'},
    { label: 'label.DBRT04.Subdistrict',routerLink: '/db/dbrt04/district/subdistricts/'},
    { label: 'label.DBRT04.Detail', routerLink: '/db/dbrt04/district/subdistricts/subdistricts-detail' },
]
constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private ms: NotifyService,
  private sv: Dbrt04Service,
  private md: ModalService,) {
  this.createForm()
  this.route.data.subscribe(({ dbrt04master , dbrt04SubdistrictDetail }) => {
    this.master = dbrt04master;
    this.provinceCode = dbrt04SubdistrictDetail.provinceCode
    this.districtCode = dbrt04SubdistrictDetail.districtCode
    this.breadcrumbItems.map(m => {
      if(m.routerLink === '/db/dbrt04/district') m.state = {districtCode : this.districtCode , provinceCode : this.provinceCode}
      else if(m.routerLink === '/db/dbrt04/district/subdistricts/')m.state = {districtCode : this.districtCode , provinceCode : this.provinceCode}
    })
     this.data = dbrt04SubdistrictDetail
     if(this.data) this.form.patchValue(this.data)
     this.rebuildData()
  })
}


createForm() {
  this.form = this.fb.group({
    provinceCode: [null],
    districtCode: [null],
    subdistrictCode: [null],
    subdistrictTh: [null,[Validators.required, Validators.pattern(/^[ก-๙]+$/)] ],
    subdistrictEn: [null, [Validators.required, Validators.maxLength(200),Validators.pattern(/^[A-Z a-z]+$/)]],
    postalCode: [null, [Validators.required, Validators.maxLength(5),Validators.pattern(/^[0-9]+$/)]],
    active: [null],
    description: [null, [Validators.maxLength(200)]],
    rowState: [null],
    rowVersion: [null],
  })
}

rebuildData() {
  if (this.data.subdistrictCode) {
    this.form.controls["rowState"].setValue(RowState.Normal);
  }
  else{
    this.form.controls["rowState"].setValue(RowState.Add);
    this.form.controls["active"].setValue(true);
  }
  this.form.valueChanges.subscribe(() => {
    if (this.form.controls['rowState'].value == RowState.Normal) this.form.controls['rowState'].setValue(RowState.Edit);
  })

  this.form.markAsPristine()
}

validate = () => this.form.invalid;

saveSubdistrict() {
  if (this.validate()) {
    this.ms.warning("message.STD00013");
    this.form.markAllAsTouched();
  }
  else {
    const data = this.form.getRawValue();
    this.sv.saveSubdistrict(data).pipe(
      switchMap((res:Subdistrict) => this.sv.detailSubdistrict(res.districtCode , res.subdistrictCode))
    ).subscribe((res:Subdistrict) => {
      this.data = res
      this.data.rowState = RowState.Normal;
      this.form.patchValue(res)
      this.rebuildData()
      this.ms.success("message.STD00014");

    })
  }
}

canDeactivate(): Observable<boolean> {
  if (this.form.dirty) return this.md.confirm("message.STD00010");
  return of(true);
  }
}
