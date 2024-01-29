import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Dbrt02Service, Master } from '../dbrt02.service';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '@app/models/db/employee';
import { Observable, of, switchMap } from 'rxjs';
import { RowState } from '@app/shared/types/data.types';

@Component({
  selector: 'x-dbrt02-detail',
  templateUrl: './dbrt02-detail.component.html',
  styleUrl: './dbrt02-detail.component.scss'
})
export class Dbrt02DetailComponent {
  form: FormGroup;
  data: Employee;
  master: Master = new Master();
  deletes: any = [];
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT02.ProgramName', routerLink: '/db/dbrt02' },
    { label: 'label.DBRT02.Detail', routerLink: '/db/dbrt02/detail' },
  ]


  constructor(
    private fb: FormBuilder,
    private ms: NotifyService,
    private md: ModalService,
    private route: ActivatedRoute,
    private sv: Dbrt02Service) {
    this.createForm()
    this.route.data.subscribe(({ dbrt02Detail, master }) => {
      this.data = dbrt02Detail
      this.form.patchValue(dbrt02Detail)
      this.master = master
      this.rebuildData()
    })
  }

  createForm() {
    this.form = this.fb.group({
      employeeCode: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      positionCode: [null, Validators.required],
      phoneNumber: [null, [Validators.pattern(/^[0-9]+$/), Validators.maxLength(10)]],
      email: [null, [Validators.email, Validators.maxLength(200)]],
      employeeFirstnameTh: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      employeeSurnameTh: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      employeeFirstnameEn: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      employeeSurnameEn: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      active: true,
      rowState: [null],
      gender: [null],
      dateOfBirth:[null],
      nationality: [null],
      religion: [null]
    })
  }

  rebuildData() {
    this.form.patchValue(this.data)
    if (this.data) {
      this.form.controls["employeeCode"].disable();
      this.form.controls["rowState"].setValue(RowState.Normal);
    }
    else {
      this.form.controls["rowState"].setValue(RowState.Add);
      this.form.controls["active"].setValue(true);
    }

    this.form.valueChanges.subscribe(() => {
      if (this.form.controls['rowState'].value == RowState.Normal) this.form.controls['rowState'].setValue(RowState.Edit);
    })

    this.form.markAsPristine()
  }

  validate = () => this.form.invalid;

  save() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
    }
    else {
      const data = this.form.getRawValue();
      console.log(data);
      
      this.sv.save(data).pipe(
        switchMap((res: any) => this.sv.detail(res.employeeCode))
      ).subscribe(res => {
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
