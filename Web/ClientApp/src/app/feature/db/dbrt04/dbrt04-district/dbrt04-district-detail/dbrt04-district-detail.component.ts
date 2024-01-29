import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { District } from '@app/models/db/district';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { Guid } from 'guid-typescript';
import { MenuItem } from 'primeng/api';
import { Observable, of, switchMap } from 'rxjs';
import { Dbrt04Service, Master } from '../../dbrt04.service';

@Component({
  selector: 'x-dbrt04-district-detail',
  templateUrl: './dbrt04-district-detail.component.html',
})
export class Dbrt04DistrictDetailComponent {
  form: FormGroup;
  data: District;
  master: Master;
  provinceCode:Guid;
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT04.ProgramName', routerLink: '/db/dbrt04' },
    { label: 'label.DBRT04.District', routerLink: '/db/dbrt04/dbrt04-district'},
    { label: 'label.DBRT04.Detail', routerLink: '/db/dbrt04/dbrt04-district/dbrt04-district-detail' },
]
constructor(
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private ms: NotifyService,
  private sv: Dbrt04Service,
  private md: ModalService,
  private router: Router) {
  this.createForm()
  this.route.data.subscribe(({ master , dbrt04DistrictDetail }) => {
    this.master = master;
    this.provinceCode = dbrt04DistrictDetail.provinceCode
    this.breadcrumbItems.map(m => {
      if(m.routerLink === '/db/dbrt04/dbrt04-district') m.state = {provinceCode : this.provinceCode}
    })
     this.data = dbrt04DistrictDetail
     if(this.data) this.form.patchValue(this.data)
     this.rebuildData()
  })
}


createForm() {
  this.form = this.fb.group({
    province: [null],
    provinceCode: [null],
    provinceTh: [null],
    districtCode: [null],
    districtTh: [null,[Validators.required, Validators.pattern(/^[ก-๙]+$/)] ],
    districtEn: [null, [Validators.required, Validators.maxLength(200),Validators.pattern(/^[A-Z a-z]+$/)]],
    active: [null],
    description: [null, [Validators.maxLength(200)]],
    rowState: [null],
    rowVersion: [null],
  })
}

rebuildData() {
  if (this.data.districtCode) {
    this.form.controls["province"].disable();
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

saveDistrict() {
  if (this.validate()) {
    this.ms.warning("message.STD00013");
    this.form.markAllAsTouched();
  }
  else {
    const data = this.form.getRawValue();
    this.sv.saveDistrict(data).pipe(
      switchMap((res:District) => this.sv.detailDistrict(res.districtCode, res.provinceCode))
    ).subscribe((res:District) => {
      this.data = res
      this.data.rowState = RowState.Normal;
      this.form.patchValue(res)
      this.rebuildData()
      this.ms.success("message.STD00014");
      // this.router.navigateByUrl('db/dbrt04');
    })
  }
}

canDeactivate(): Observable<boolean> {
  if (this.form.dirty) return this.md.confirm("message.STD00010");
  return of(true);
}
}
