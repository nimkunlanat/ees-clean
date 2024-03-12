import { Component } from '@angular/core';
import { Approve } from '@app/models/et/approve';
import { Etdt02Service } from '../etdt02.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'x-etdt02-document',
  templateUrl: './etdt02-document.component.html',
})

export class Etdt02DocumentComponent {
  @Component({
    selector: 'x-etdt02',
    templateUrl: './etdt02.component.html',
  })
    Approves: Approve[] = []
    assessment: string

    constructor(
      private sv: Etdt02Service,
      private activatedRoute: ActivatedRoute,
      private md: ModalService,
      private ms: NotifyService) {
      this.activatedRoute.data.subscribe(({ Approves }) => {this.Approves = Approves
      console.log(Approves) })
    }
    search(value? : string) {
      this.sv.list(value,null).subscribe((Approves: Approve[]) => this.Approves = Approves)
    }
  }
