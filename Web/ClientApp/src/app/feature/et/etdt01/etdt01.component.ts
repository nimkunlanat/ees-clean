import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { DocumentApproved } from '@app/models/et/documentApproved';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Guid } from 'guid-typescript';
import { filter, switchMap } from 'rxjs';
import { Etdt01Service } from './etdt01.service';

@Component({
  selector: 'x-etdt01',
  templateUrl: './etdt01.component.html',
  styleUrl: './etdt01.component.scss',

})
export class Etdt01Component {
  DocumentApproveds: DocumentApproved[] = [];

  constructor(
  private sv: Etdt01Service,
  private activatedRoute: ActivatedRoute,
  private md: ModalService,
  private ms: NotifyService,
  private router: Router){
    this.activatedRoute.data.subscribe(({ DocumentApproveds }) => this.DocumentApproveds = DocumentApproveds)
  }
  createform(documentNo?: Guid){
    this.router.navigate(['/et/etdt01/assessment'] , {state: {documentNo: documentNo}});
    console.log(documentNo);

  }

  delete(documentNo: Guid) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(documentNo)))
      .subscribe(() => {
        this.DocumentApproveds = this.DocumentApproveds.filter(doc => doc.documentNo !== documentNo);
        this.ms.success('message.STD00016');
      })
  }
}
