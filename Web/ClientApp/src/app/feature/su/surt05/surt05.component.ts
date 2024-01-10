import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { Message } from '@app/models/su/message';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Surt05Service } from './surt05.service';

@Component({
  selector: 'x-surt05',
  templateUrl: './surt05.component.html',
  styleUrl: './surt05.component.scss'
})
export class Surt05Component {
  message: Message[] = []

  constructor(
    private sv: Surt05Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({ messages }) => {
      console.log(messages)
      this.message = messages
    })
  }

  search(value?: string) {
    this.sv.list(value).subscribe((message: Message[]) => this.message = message)
  }

  edit(messageCode: number) {
    // this.md.confirm('message.STD00015').pipe(
    //   filter(confirm => confirm),
    //   switchMap(() => this.sv.delete(userId)))
    //   .subscribe((res: any) => {
    //     this.search()
    //     this.ms.success('message.STD00016');
      // })
  }
}
