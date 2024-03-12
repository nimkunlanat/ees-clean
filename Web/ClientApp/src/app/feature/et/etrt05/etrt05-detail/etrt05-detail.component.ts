import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluateGroup } from '@app/models/et/evaluateGroup';
import { Etrt05Service } from '../etrt05.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { EvaluateDetail } from '@app/models/et/evaluateDetail';
import { Observable, of, pipe, switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-etrt05-detail',
  templateUrl: './etrt05-detail.component.html',
})
export class Etrt05DetailComponent {
  form: FormGroup;
  evaluationGroup: EvaluateGroup = new EvaluateGroup();
  deletes: EvaluateDetail[] = []
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETRT05.ProgramName', routerLink: '/et/etrt05' },
    { label: 'label.ETRT05.EvaluationMangement', routerLink: '/et/etrt05/evaluation' },
    { label: 'label.ETRT05.EvaluationProgramName', routerLink: '/et/etrt05/evaluation/detail' },
  ]
  roleCode: string;

  constructor(
    private sv: Etrt05Service,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ms: NotifyService,
    private md: ModalService) {
    this.activatedRoute.data.subscribe(({ evaluationDetail, roleCode }) => {
      this.evaluationGroup = evaluationDetail?.detail ?? new EvaluateGroup()
      this.roleCode = evaluationDetail?.roleCode ?? roleCode
      this.evaluationGroup.roleCode = this.roleCode
      this.breadcrumbItems[1]["state"] = { roleCode: this.roleCode }
      this.createForm()
      this.rebuildForm()
      this.form.controls["roleCode"].disable();
    })
  }



  createForm() {
    this.form = this.fb.group({
      roleCode: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 /\\]+$/)]],
      evaluateGroupCode: [null, [Validators.required, Validators.maxLength(50)]],
      evaluateGroupNameTh: [null, [Validators.required, Validators.pattern(/^[ก-๙0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      evaluateGroupNameEn: [null, [Validators.required, Validators.pattern(/^[a-zA-Z#$.' ^+=!*(){}\[\]@%& /\\]+$/)]],
      totalPoint: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      sequeneId: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    });


    this.form.valueChanges.subscribe(() => {
      if (this.form.controls["rowState"].value == RowState.Normal) this.form.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })
  }

  createFormDetail(evaluationDetail: EvaluateDetail) {
    const fg: FormGroup = this.fb.group({
      evaluateGroupCode: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9 /\\]+$/)]],
      evaluateDetailCode: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(10)]],
      evaluateDetailNameTh: [null, [Validators.required, Validators.pattern(/^[ก-๙0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      evaluateDetailNameEn: [null, [Validators.required, Validators.pattern(/^[a-zA-Z#$.' ^+=!*(){}\[\]@%& /\\]+$/)]],
      point: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      sequeneId: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    })

    fg.patchValue(evaluationDetail);

    if (evaluationDetail.evaluateDetailCode) fg.controls["evaluateDetailCode"].disable();

    fg.valueChanges.subscribe(() => {
      if (fg.controls["rowState"].value == RowState.Normal) fg.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })

    return fg;
  }

  rebuildForm() {
    this.deletes = [];
    this.form.patchValue(this.evaluationGroup)

    if (this.evaluationGroup.evaluateGroupCode) {
      this.form.controls["roleCode"].disable();
      this.form.controls["evaluateGroupCode"].disable();
      this.form.controls["evaluateGroupNameTh"]
      this.form.controls["evaluateGroupNameEn"]
      this.form.controls["totalPoint"]
      this.form.controls["rowState"].setValue(RowState.Normal)
    }
    else this.form.controls["rowState"].setValue(RowState.Add)

    this.evaluationGroup.evaluateDetails.map(m => m.form = this.createFormDetail(m))
    this.form.markAsPristine();
    this.evaluationGroup.evaluateDetails.forEach(f => f.form.markAsPristine())
  }

  add() {
    let evaluateDetails = new EvaluateDetail();
    evaluateDetails.rowState = RowState.Add;
    evaluateDetails.form = this.createFormDetail(evaluateDetails);
    this.evaluationGroup.evaluateDetails.push(evaluateDetails);
  }

  remove(EvaluateDetails: EvaluateDetail) {
    if (EvaluateDetails.form?.controls['rowState'].value != RowState.Add) {
      EvaluateDetails.form?.controls['rowState'].setValue(RowState.Delete);
    }

    this.deletes.push(EvaluateDetails)
    this.evaluationGroup.evaluateDetails = this.evaluationGroup.evaluateDetails.filter((evaluateDetails: EvaluateDetail) => evaluateDetails.guid != EvaluateDetails.guid);
  }

  //validate = (): boolean => (this.form.invalid || this.evaluationGroup.evaluateDetails.some(s => s.form.invalid))

  validate = () => this.form.invalid

  save() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
      this.evaluationGroup.evaluateDetails.forEach(f => f.form.markAllAsTouched())
    }
    else {
      const data = this.form.getRawValue();
      console.log(data)
      data["evaluateDetails"] = [...this.evaluationGroup.evaluateDetails.map(m => m.form.getRawValue()), ...this.deletes.map(m => m.form.getRawValue()).filter(f => f.rowState != RowState.Add)];
      data["evaluateDetails"].filter(f => f.evaluateGroupCode == null).forEach(f => {
        f.evaluateGroupCode = this.form.controls["evaluateGroupCode"].value;
      })
      if (data.rowVersion) data.rowState = RowState.Edit;
      else data.rowState = RowState.Add;
      this.sv.save(data).pipe(
        switchMap((evaluationGroup: EvaluateGroup) => this.sv.detail(evaluationGroup.evaluateGroupCode))
      ).subscribe((res: EvaluateGroup) => {
        this.ms.success("message.STD00014")
        this.evaluationGroup = res
        this.rebuildForm()
      })
    }
  }
  canDeactivate(): Observable<boolean> {
    if (this.form.dirty || this.evaluationGroup.evaluateDetails.some(s => s.form.dirty) || this.deletes.length > 0 || this.evaluationGroup.evaluateDetails.some(s => s.form.controls["rowState"].value == RowState.Add)) return this.md.confirm("message.STD00010");
    return of(true);
  }
}
