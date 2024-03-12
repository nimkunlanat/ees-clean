import { Component } from '@angular/core';
import { EvaluateGroup } from '@app/models/et/evaluateGroup';
import { Etrt05Service } from '../etrt05.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter, of, switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { EvaluateForm } from '@app/models/et/evaluateForm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RowState } from '@app/shared/types/data.types';

@Component({
  selector: 'x-etrt05-evaluation',
  templateUrl: './etrt05-evaluation.component.html'
})
export class Etrt05EvaluationComponent {

  form: FormGroup;
  evaluationGroups: EvaluateGroup[] = [];
  deletes: EvaluateForm[] = []
  roleCode: string
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETRT05.ProgramName', routerLink: '/et/etrt05' },
    { label: 'label.ETRT05.EvaluationMangement', routerLink: '/et/etrt05/evaluation' },
  ]
  evaluateGroupCode
  constructor(
    private sv: Etrt05Service,
    private md: ModalService,
    private ms: NotifyService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.data.subscribe(({ evaluationList, roleList }) => {
      this.evaluationGroups = evaluationList.list ?? []
      this.roleCode = evaluationList.params
      this.createForm()
      let currentRole = roleList.filter(f => f.roleCode === this.roleCode)[0]
      this.form.patchValue(currentRole)
      if (this.roleCode)
        this.form.controls["roleCode"].disable();
      this.evaluateGroupCode = this.evaluationGroups[0].evaluateGroupCode
    })
  }


  createForm() {
    this.form = this.fb.group({
      roleCode: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9/\\]+$/)]],
      roleNameTh: [null, [Validators.required, Validators.pattern(/^[ก-๙0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      roleNameEn: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    });

    this.form.valueChanges.subscribe(() => {
      if (this.form.controls["rowState"].value == RowState.Normal) this.form.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })
  }

  createFormDetail(evaluationGroup: EvaluateGroup) {
    const fg: FormGroup = this.fb.group({
      roleCode: [null, [Validators.required, Validators.maxLength(50)]],
      evaluateGroupCode: [null, [Validators.required, Validators.maxLength(50)]],
      evaluateGroupNameTh: [null, [Validators.required, Validators.pattern(/^[ก-๙0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      evaluateGroupNameEn: [null, [Validators.required, Validators.pattern(/^[a-zA-Z#$.' ^+=!*(){}\[\]@%& /\\]+$/)]],
      totalPoint: [0, [Validators.required]],
      sequeneId: [0, [Validators.required]],
      active: true,
      rowState: null,
      rowVersion: null
    });
  }

  rebuildData() {
    this.deletes = [];
    this.form.patchValue(this.evaluationGroups)

    // if (this.evaluationGroups.evaluateGroupCode) {
    //   this.form.controls["roleCode"].disable()
    //   this.form.controls["roleNameTh"].disable()
    //   this.form.controls["roleNameEn"]
    //   this.form.controls["rowState"].setValue(RowState.Normal)
    // }
    // else this.form.controls["rowState"].setValue(RowState.Add)

    // this.evaluationGroups.evaluateDetails.map(m => m.form = this.createFormDetail(m))
    // this.form.markAsPristine();
    // this.evaluationGroups.evaluateDetails.forEach(f => f.form.markAsPristine())
  }


  delete(evaluateGroupCode: string) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(evaluateGroupCode)))
      .subscribe((res: any) => {
        // this.search()
        this.ms.success('message.STD00016');
      })
  }

  validate = () => this.form.invalid

  saveForm() {
    // const data = this.form.getRawValue()
    // data["evaluationGroups"] = this.evaluationGroups
    // console.log(data)
    if (this.validate()) {
      console.log('invalid');
      this.ms.warning('meassge.STD00013');
      this.form.markAllAsTouched();
    }
    else {

      const data = this.form.getRawValue();
      console.log('valid', data);
      if (data.rowVersion) data.rowState = RowState.Edit;
      else data.rowState = RowState.Add;
      this.sv.saveForm(data).pipe(
        switchMap((res: any) => this.sv.evaluation('', res))
      ).subscribe(res => {
        this.ms.success("message.STD00014");
        this.evaluationGroups = res
        //this.evaluationGroups = RowState.Normal;
        this.form.patchValue(res)
        this.rebuildData()
      })
    }
  }
  canDeactivate(): Observable<boolean> {
    if (this.form.dirty) return this.md.confirm("message.STD00010");
    return of(true);
  }
}




