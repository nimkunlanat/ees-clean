import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { Approve } from '@app/models/et/approve';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Etdt02Service } from './etdt02.service';

@Component({
  selector: 'x-etdt02',
  templateUrl: './etdt02.component.html',
})
export class Etdt02Component {

  Approves: Approve[] = []

  constructor(
    private sv: Etdt02Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({ Approves }) => this.Approves = Approves)
  }

  search(value?: string) {
    this.sv.list(value).subscribe((Approves: Approve[]) => this.Approves = Approves)
  }
}
