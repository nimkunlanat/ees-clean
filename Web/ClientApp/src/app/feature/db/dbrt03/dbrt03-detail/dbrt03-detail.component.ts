import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { Position } from '@app/models/db/position';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { MenuItem } from 'primeng/api';
import { Observable, of, switchMap } from 'rxjs';
import { Dbrt03Service } from '../dbrt03.service';

@Component({
  selector: 'x-dbrt03-detail',
  templateUrl: './dbrt03-detail.component.html',
  styleUrl: './dbrt03-detail.component.scss'
})
export class Dbrt03DetailComponent {
  form: FormGroup;
  positions: Position;
  parameter: { positionCode: string }
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT03.ProgramName', routerLink: '/db/dbrt03' },
    { label: 'label.DBRT03.Detail', routerLink: '/db/dbrt03/detail' },
  ]

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ms: NotifyService,
    private sv: Dbrt03Service,
    private md: ModalService) {
      this.createForm()
      this.route.data.subscribe(({ dbrt03Detail }) => {
        this.positions = dbrt03Detail
        this.form.patchValue(dbrt03Detail)
        this.rebuildData()
      })
    }

  rebuildData() {
    this.form.patchValue(this.positions)
    if (this.positions) {
      this.form.controls["positionCode"].disable();
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

  createForm() {
    this.form = this.fb.group({
      positionCode: [null, [Validators.required, Validators.maxLength(20)]],
      positionNameTh: [null, [Validators.required, Validators.maxLength(100)]],
      positionNameEn: [null, [Validators.required, Validators.maxLength(100)]],
      description: null,
      rowState: null,
      rowVersion: null,
      active: true
    })
  }

  validate = () => this.form.invalid;

  save() {
    if (this.validate()) {
      this.ms.warning('message.STD00013');
      this.form.markAllAsTouched();
    }
    else {
      const data = this.form.getRawValue();
      
      this.sv.save(data).pipe(
        switchMap((res: any) => this.sv.detail(res.employeeCode))
      ).subscribe(res => {
        this.positions = res
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
