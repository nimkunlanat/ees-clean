import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Etrt05Service } from './etrt05.service';
import { filter, switchMap } from 'rxjs';
import { EvaluateGroup } from '@app/models/et/evaluateGroup';
import { EvaluateForm } from '@app/models/et/evaluateForm';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-etrt05',
  templateUrl: './etrt05.component.html'
})

export class Etrt05Component {

  evaluationForms: EvaluateForm[] = []
  deletes: EvaluateForm[] = []
  
  constructor(
    private sv: Etrt05Service,
    private md: ModalService,
    private ms: NotifyService,
    private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.data.subscribe(({ roleList }) => {
      this.evaluationForms = roleList
    })
  }
  search(value?: string) {
    this.sv.list(value).subscribe((roleLists: EvaluateForm[]) => {this.evaluationForms = roleLists})
  }
  deleteForm(roleCode: string) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.deleteForm(roleCode)))
      .subscribe((res: any) => {
        this.search()
        this.ms.success('message.STD00016');
      })
  }

    
}
