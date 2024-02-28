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
import { Observable, of, switchMap } from 'rxjs';

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
      groupId: [null, [Validators.maxLength(50)]],
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
      groupId: null,
      subjectGroup: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(10)]],
      subjectName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.maxLength(10)]],
      description: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
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
    let skillMatrixSubjects = new SkillMatrixSubject();
    skillMatrixSubjects.rowState = RowState.Add;
    skillMatrixSubjects.form = this.createFormDetail(skillMatrixSubjects);
    this.skillMatrixGroup.skillMatrixSubjects.push(skillMatrixSubjects);
  }

  remove(SkillMatrixSubjects: SkillMatrixSubject) {
    if (SkillMatrixSubjects.form?.controls['rowState'].value != RowState.Add) {
      SkillMatrixSubjects.form?.controls['rowState'].setValue(RowState.Delete);
    }

    this.deletes.push(SkillMatrixSubjects)
    this.skillMatrixGroup.skillMatrixSubjects = this.skillMatrixGroup.skillMatrixSubjects.filter((skillMatrixSubjects: SkillMatrixSubject) => skillMatrixSubjects.guid != SkillMatrixSubjects.guid);
  }

  validate = () => this.form.invalid

  saveForm() {
    if (this.validate()) {
      this.ms.warning("message.STD000013");
      this.form.markAllAsTouched();
      this.skillMatrixGroup.skillMatrixSubjects.forEach(f => f.form.markAllAsTouched())
    }
    else {
      const data: SkillMatrixGroup = this.form.getRawValue();
      data["skillMatrixSubjects"] = [...this.skillMatrixGroup.skillMatrixSubjects.map(m => m.form.getRawValue()), ...this.deletes.map(m => m.form.getRawValue()).filter(f => f.rowState != RowState.Add)];
      data["skillMatrixSubjects"].filter(f => f.groupId == null).forEach(f => {
        f.groupId = this.form.controls["groupId"].value;
      })
      if (data.rowVersion) data.rowState = RowState.Edit;
      else data.rowState = RowState.Add;
      this.sv.saveForm(data).pipe(
        switchMap((skillMatrixGroup: any) => this.sv.detail(skillMatrixGroup.groupId))
      ).subscribe((res: any) => {
        this.ms.success("message.STD00014")
        this.skillMatrixGroup = res
        this.rebuildForm()
      })
    }
  }
}
