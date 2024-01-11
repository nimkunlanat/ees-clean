import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { Dbrt01Service } from './dbrt01.service';
import { Status } from '@app/models/db/status';
import { filter, switchMap } from 'rxjs';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'x-dbrt01',
  templateUrl: './dbrt01.component.html',
})
export class Dbrt01Component {

  statuses: Status[] = []

  constructor(
    private sv: Dbrt01Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({ statuses }) => this.statuses = statuses)
  }

  search(value?: string) {
    this.sv.list(value).subscribe((statuses: Status[]) => this.statuses = statuses)
  }

  delete(Id: Guid) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(Id)))
      .subscribe((res: any) => {
        this.search()
        this.ms.success('message.STD00016');
      })
}

}
