import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { Status } from '@app/models/db/status';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { MenuItem } from 'primeng/api';
import { Observable, of, switchMap } from 'rxjs';
import { Dbrt01Service,  } from '../dbrt01.service';

@Component({
  selector: 'x-dbrt01-detail',
  templateUrl: './dbrt01-detail.component.html'
})
export class Dbrt01DetailComponent {
  form: FormGroup;
  data: Status;
  breadcrumbItems: MenuItem[] = [
    { label: 'label.DBRT01.ProgramName', routerLink: '/db/dbrt01' },
    { label: 'label.DBRT01.Detail', routerLink: '/db/dbrt01/detail' },
  ]
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ms: NotifyService,
    private sv: Dbrt01Service,
    private md: ModalService) {
    this.createForm()
    this.route.data.subscribe(({ detail }) => {
      this.data = detail
      this.form.patchValue(detail)
      this.rebuildData()
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(200)]],
      descTh: [null,[Validators.pattern(/^[ก-๙ ]+$/)] ],
      descEn: [null, [Validators.required, Validators.maxLength(200),Validators.pattern(/^[A-Z a-z]+$/)]],
      tableName: [null, [Validators.required, Validators.maxLength(200)]],
      columnName: [null, [Validators.required, Validators.maxLength(200)]],
      active: [null],
      rowState: [null],
      rowVersion: [null],
      backgroundColor : [null],
      fontColor : [null],
    })
  }

  rebuildData() {
    if (this.data) {
      this.form.controls["code"].disable();
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

  save() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
    }
    else {
      const data = this.form.getRawValue();
      this.sv.save(data).pipe(
        switchMap((res: any) => this.sv.detail(res.id))
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


