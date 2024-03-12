import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillMatrixGrade } from '@app/models/et/skillMatrixGrade';
import { MenuItem } from 'primeng/api';
import { Etrt06Service } from '../etrt06.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Guid } from 'guid-typescript';
import { SkillMatrixSubject } from '@app/models/et/skillMatrixSubject';
import { RowState } from '@app/shared/types/data.types';
import { skillMatrixGroup } from '../etrt06.resolver';
import { switchMap } from 'rxjs';

@Component({
  selector: 'x-etrt06-grade',
  templateUrl: './etrt06-grade.component.html'
})
export class Etrt06GradeComponent {
  form: FormGroup;
  deletes: SkillMatrixGrade[] = []
  skillMatrixSubject: SkillMatrixSubject = new SkillMatrixSubject()
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETRT06.ProgramName', routerLink: '/et/etrt06' },
    { label: 'label.ETRT06.Detail', routerLink: '/et/etrt06/detail' },
    { label: 'label.ETRT06.SkillMatrixGrade', routerLink: '/et/etrt06/detail/grade' }
  ]

  constructor(
    private sv: Etrt06Service,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ms: NotifyService,
    private md: ModalService) {
    this.activatedRoute.data.subscribe(
      ({ skillMatrixGrade }) => {
        this.skillMatrixSubject = skillMatrixGrade.grade ?? new SkillMatrixSubject()
        this.breadcrumbItems[1]["state"] = { groupId: skillMatrixGrade.params }
        this.createForm()
        this.rebuildForm()
        this.form.controls["subjectGroup"].disable();
      })
  }

  createForm() {
    this.form = this.fb.group({
      subjectId: null,
      subjectGroup: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      subjectName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      description: [null, [Validators.pattern(/^[ก-ฮa-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    });

    this.form.valueChanges.subscribe(() => {
      if (this.form.controls["rowState"].value == RowState.Normal) this.form.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })

  }

  createFormDetail(skillMatrixGrade: SkillMatrixGrade) {
    const fg: FormGroup = this.fb.group({
      gradeId: null,
      groupId:null,
      grade: [null, [Validators.required, Validators.maxLength(1), Validators.pattern(/^[A-Z/\\]+$/)]],
      description: [null, [Validators.pattern(/^[ก-ฮa-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      score: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      expectedScore: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      example: [null, [Validators.pattern(/^[ก-ฮa-zA-Z0-9#$^+=!*(){}\[\]@%& /\\]+$/)]],
      active: true,
      rowState: null,
      rowVersion: null
    })

    fg.patchValue(skillMatrixGrade);

    if (skillMatrixGrade.gradeId) fg.controls["gradeId"].disable();

    fg.valueChanges.subscribe(() => {
      if (fg.controls["rowState"].value == RowState.Normal) fg.controls["rowState"].setValue(RowState.Edit, { emitEvent: false });
    })

    return fg;
  }

  rebuildForm() {
    this.deletes = [];
    this.form.patchValue(this.skillMatrixSubject)

    if (this.skillMatrixSubject.subjectId) {
      this.form.controls['subjectGroup']
      this.form.controls['subjectName']
      this.form.controls['description']
      this.form.controls["rowState"].setValue(RowState.Normal)
    }
    else this.form.controls["rowState"].setValue(RowState.Add)

    this.skillMatrixSubject.skillMatrixGrades.map(m => m.form = this.createFormDetail(m))

    this.form.markAsPristine();
    this.skillMatrixSubject.skillMatrixGrades.forEach(f => f.form.markAsPristine())
  }

  addGrade() {
    let skillMatrixGrades = new SkillMatrixGrade();
    skillMatrixGrades.rowState = RowState.Add;
    skillMatrixGrades.form = this.createFormDetail(skillMatrixGrades);
    this.skillMatrixSubject.skillMatrixGrades.push(skillMatrixGrades);
  }

  remove(SkillMatrixGrades: SkillMatrixGrade) {
    if (SkillMatrixGrades.form?.controls['rowState'].value != RowState.Add) {
      SkillMatrixGrades.form?.controls['rowState'].setValue(RowState.Delete);
    }

    this.deletes.push(SkillMatrixGrades)
    this.skillMatrixSubject.skillMatrixGrades = this.skillMatrixSubject.skillMatrixGrades.filter((skillMatrixGrades: SkillMatrixGrade) => skillMatrixGrades.guid != SkillMatrixGrades.guid);
  }

  validate = () => this.form.invalid

  saveGrade() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
      this.skillMatrixSubject.skillMatrixGrades.forEach(f => f.form.markAllAsTouched())
    }
    else {
      const data = this.form.getRawValue();
      console.log(data)
      data["skillMatrixGrades"] = [...this.skillMatrixSubject.skillMatrixGrades.map(m => m.form.getRawValue()), ...this.deletes.map(m => m.form.getRawValue()).filter(f => f.rowState != RowState.Add)];
      data["skillMatrixGrades"].filter(f => f.subjectId == null).forEach(f => {
        f.subjectId = this.form.controls["subjectId"].value;
      })
      if(data.rowVersion) data.rowState = RowState.Edit;
      else data.rowState = RowState.Add;
      this.sv.saveGrade(data).pipe(
        switchMap((skillMatrixSubject: SkillMatrixSubject) => this.sv.grade(skillMatrixSubject.subjectId))
      ).subscribe((res: any) => {
        this.ms.success("message.STD00014")
        this.skillMatrixSubject = res
        this.rebuildForm()
      })
    }
  }

}


