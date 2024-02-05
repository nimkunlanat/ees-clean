import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationGroup } from '@app/models/et/evaluationGroup';
import { Etrt05Service } from '../etrt05.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { EvaluationDetail } from '@app/models/et/evaluationDetail';
import { switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-etrt05-detail',
  templateUrl: './etrt05-detail.component.html',
})
export class Etrt05DetailComponent {
  form : FormGroup;
  evaluationGroup: EvaluationGroup = new EvaluationGroup();
  deletes: EvaluationDetail[] = []
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETRT05.ProgramName', routerLink: '/et/etrt05' },
    { label: 'label.ETRT05.Detail', routerLink: '/et/etrt05/detail' },
  ]

  constructor(
    private sv: Etrt05Service,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ms: NotifyService,
    private md: ModalService) {
    this.activatedRoute.data.subscribe(({ evaluationGroup }) => {
      console.log(evaluationGroup);
      
      this.evaluationGroup = evaluationGroup ?? new EvaluationGroup()
      this.createForm()
      this.rebuildForm()
    })
  }

  createForm() {
    this.form = this.fb.group({
      evaluateGroupCode: [null, [Validators.required, Validators.maxLength(50)]],
      evaluateGroupNameTh: [null, [Validators.maxLength(200)]],
      evaluateGroupNameEn: [null, [Validators.maxLength(200)]],
      totalPoint: null,
      rowState: null,
      rowVersion: null
    });


    this.form.valueChanges.subscribe(() => {
      if (this.form.controls["rowState"].value == RowState.Normal) this.form.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })
  }

  createFormDetail(evaluationDetail: EvaluationDetail) {
    const fg: FormGroup = this.fb.group({
      evaluateGroupCode:  [null, Validators.required],
      evaluateDetailCode: [null, Validators.required],
      evaluateDetailNameTh: [null, Validators.required],
      evaluateDetailNameEn: null,
      point: null,
      rowState: null,
      rowVersion: null
    })

    fg.patchValue(evaluationDetail);

    if (evaluationDetail.evaluateDetailCode) fg.controls["fieldName"].disable();

    fg.valueChanges.subscribe(() => {
      if (fg.controls["rowState"].value == RowState.Normal) fg.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })

    return fg;
  }

  rebuildForm() {
    this.deletes = [];
    this.form.patchValue(this.evaluationGroup)

    if (this.evaluationGroup.evaluateGroupCode) {
      this.form.controls["evaluateGroupCode"].disable()
      this.form.controls["evaluateGroupNameTh"].disable()
      this.form.controls["evaluateGroupNameEn"].disable()
      this.form.controls["totalPoint"].disable()
      this.form.controls["rowState"].setValue(RowState.Normal)
    }
    else this.form.controls["rowState"].setValue(RowState.Add)

    this.form.markAsPristine();
    this.evaluationGroup.evaluateDetailCodes.forEach(f => f.form.markAsPristine())
  }

  validate = (): boolean => (this.form.invalid || this.evaluationGroup.evaluateDetailCodes.some(s => s.form.invalid))

  save() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
      this.evaluationGroup.evaluateDetailCodes.forEach(f => f.form.markAllAsTouched())
    }
    else {
      const data = this.form.getRawValue();
      data["evaluateDetailCodes"] = [...this.evaluationGroup.evaluateDetailCodes.map(m => m.form.getRawValue()), ...this.deletes.map(m => m.form.getRawValue()).filter(f => f.rowState != RowState.Add)];
      data["evaluateDetailCodes"].filter(f => f.evaluateGroupCode == null).forEach(f => {
        f.evaluateGroupCode = this.form.controls["evaluateGroupCode"].value;
      })
      this.sv.save(data).pipe(
        switchMap((evaluationGroup: EvaluationGroup) => this.sv.detail(evaluationGroup.evaluateGroupCode))
      ).subscribe((res: EvaluationGroup) => {
        console.log(res)
        this.evaluationGroup = res
        this.rebuildForm()
        this.ms.success("message.STD00014")
      })
    }
  }

}
