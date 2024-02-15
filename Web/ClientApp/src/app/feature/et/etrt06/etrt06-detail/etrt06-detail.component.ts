import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillMatrixGroup } from '@app/models/et/skillMatrixGroup';
import { SkillMatrixSubject } from '@app/models/et/skillMatrixSubject';
import { MenuItem } from 'primeng/api';
import { Etrt06Service } from '../etrt06.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';

@Component({
  selector: 'x-etrt06-detail',
  templateUrl: './etrt06-detail.component.html'
})
export class Etrt06DetailComponent {
  form: FormGroup;
  skillMatrixGroup: SkillMatrixGroup = new SkillMatrixGroup();
  deletes: SkillMatrixSubject[] = []
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETRT06.ProgramName', routerLink: '/et/etrt06' },
    { label: 'label.ETRT06.Detail', routerLink: '/et/etrt06/detail' },
  ]

  constructor(
    private sv: Etrt06Service,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ms: NotifyService,
    private md: ModalService) {
    this.activatedRoute.data.subscribe(({ skillMatrixGroup }) => {
      console.log(skillMatrixGroup);
      
      this.skillMatrixGroup = skillMatrixGroup ?? new SkillMatrixGroup()
      this.createForm()
      this.rebuildForm()
    })
  }

  createForm() {
    this.form = this.fb.group({
      groupId: [null, [Validators.required, Validators.maxLength(50)]],
      groupName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      description: [null, [Validators.required, Validators.pattern(/^[ก-ฮa-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    });

    this.form.valueChanges.subscribe(() => {
      if (this.form.controls["rowState"].value == RowState.Normal) this.form.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })
  }

  createFormDetail(skillMatrixSubject: SkillMatrixSubject) {
    const fg: FormGroup = this.fb.group({
      subjectId: null,
      groupId:null,
      subjectGroup: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(10)]],
      subjectName:  [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(10)]],
      description: [null, [Validators.required, Validators.pattern(/^[a-zA-Z#$.' ^+=!*(){}\[\]@%& /\\]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    })

    fg.patchValue(skillMatrixSubject);

    if (skillMatrixSubject.groupId) fg.controls["groupId"].disable();

    fg.valueChanges.subscribe(() => {
      if (fg.controls["rowState"].value == RowState.Normal) fg.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })

    return fg;
  }
  rebuildForm() {
    this.deletes = [];
    this.form.patchValue(this.skillMatrixGroup)
    
    if (this.skillMatrixGroup.groupId) {

      this.form.controls["groupName"]
      this.form.controls["description"]
      this.form.controls["rowState"].setValue(RowState.Normal)
    }
    else this.form.controls["rowState"].setValue(RowState.Add)
    
    this.skillMatrixGroup.skillMatrixSubjects.map(m => m.form = this.createFormDetail(m))
    this.form.markAsPristine();
    this.skillMatrixGroup.skillMatrixSubjects.forEach(f => f.form.markAsPristine())
  }

    add() {

    }

    save(){

    }

    remove(){
      
    }
}
