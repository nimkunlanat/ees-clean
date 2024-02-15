import { Component } from '@angular/core';
import { EvaluationGroup } from '@app/models/et/evaluationGroup';
import { Etrt05Service } from '../etrt05.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { EvaluationForm } from '@app/models/et/evaluationForm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RowState } from '@app/shared/types/data.types';

@Component({
  selector: 'x-etrt05-evaluation',
  templateUrl: './etrt05-evaluation.component.html'
})
export class Etrt05EvaluationComponent {

  form: FormGroup;
  evaluationGroups: EvaluationGroup[] = [];
  deletes: EvaluationForm[] = []
  roleCode: string
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETRT05.ProgramName', routerLink: '/et/etrt05' },
  ]

  constructor(
    private sv: Etrt05Service,
    private md: ModalService,
    private ms: NotifyService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.data.subscribe(({ evaluationList, roleList }) => {
      console.log(evaluationList)
      this.evaluationGroups = evaluationList.list ?? []
      this.roleCode = evaluationList.params
      this.createForm()
      let currentRole = roleList.filter(f => f.roleCode === this.roleCode)[0]
      this.form.patchValue(currentRole)
    })
  }

  createForm() {
    this.form = this.fb.group({
      roleCode: [null, [Validators.required, Validators.maxLength(50)]],
      roleNameTh: [null, [Validators.required, Validators.pattern(/^[ก-ฮa-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      roleNameEn: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    });

    this.form.valueChanges.subscribe(() => {
      if (this.form.controls["rowState"].value == RowState.Normal) this.form.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })
  }

  createFormDetail(evaluationGroup: EvaluationGroup){
    const fg: FormGroup = this.fb.group({
      roleCode:[null, [Validators.required, Validators.maxLength(50)]],
      evaluateGroupCode: [null, [Validators.required, Validators.maxLength(50)]],
      evaluateGroupNameTh: [null, [Validators.required, Validators.pattern(/^[ก-๙0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      evaluateGroupNameEn: [null, [Validators.required, Validators.pattern(/^[a-zA-Z#$.' ^+=!*(){}\[\]@%& /\\]+$/)]],
      totalPoint: [0,[Validators.required]],
      sequeneId: [0,[Validators.required]],
      active: true,
      rowState: null,
      rowVersion: null
    });
  }

  rebuildForm(){
    
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

  validate = (): Boolean => false

  save(){
    
  }
}




