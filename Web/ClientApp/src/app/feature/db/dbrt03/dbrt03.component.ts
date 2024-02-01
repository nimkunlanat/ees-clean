import { Component } from '@angular/core';
import { Position } from '@app/models/db/position';
import { Dbrt03Service } from './dbrt03.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'x-dbrt03',
  templateUrl: './dbrt03.component.html',
  styleUrl: './dbrt03.component.scss'
})
export class Dbrt03Component {

    positions: Position[] = []

    constructor(
      private sv: Dbrt03Service,
      private activatedRoute: ActivatedRoute,
      private md: ModalService,
      private ms: NotifyService) 
      {this.activatedRoute.data.subscribe(({ positions }) => 
      this.positions = positions)
    }
    
    search(value?: string) {
      this.sv.list(value).subscribe((positions: Position[]) => this.positions = positions)
    }

    delete(positionCode: String) {
      this.md.confirm('message.STD00015').pipe(
        filter(confirm => confirm),
        switchMap(() => this.sv.delete(positionCode)))
        .subscribe((res: any) => {
          this.search()
          this.ms.success('message.STD00016');
        })
    }
}
