import { Component } from '@angular/core';
import { SkillMatrixGroup } from '@app/models/et/skillMatrixGroup';
import { Etrt06Service } from './etrt06.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'x-etrt06',
  templateUrl: './etrt06.component.html'
})
export class Etrt06Component {

  skillMatrixGroups: SkillMatrixGroup[] = []

  constructor(
    private sv: Etrt06Service,
    private md: ModalService,
    private ms: NotifyService,
    private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.data.subscribe(({ etrt06Resolver }) => {
      this.skillMatrixGroups = etrt06Resolver
      console.log(this.skillMatrixGroups)
    })
  }
  search(value?: string) {
    this.sv.list(value).subscribe((etrt06Resolver: SkillMatrixGroup[]) => { this.skillMatrixGroups = etrt06Resolver })
  }
  delete(groupName: string) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(groupName)))
      .subscribe((res: any) => {
        this.search()
        this.ms.success('message.STD00016');
      })
  }
}


