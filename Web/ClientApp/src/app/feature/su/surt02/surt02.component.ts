import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { MenuDTO, Surt02Service } from './surt02.service';

@Component({
  selector: 'x-surt02',
  templateUrl: './surt02.component.html',
  styles: ``
})
export class Surt02Component {
  menus: MenuDTO[] = []
  resetSerch:string = ''
  constructor(
    private sv: Surt02Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({ menus }) => this.menus = menus)
  }

  search(value?: string) {
    this.sv.list(value).subscribe((menus: MenuDTO[]) => this.menus = menus)
  }

  delete(menuCode: string) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(menuCode)))
      .subscribe((res: any) => {
        this.search()
        this.resetSerch = ''
        this.ms.success('message.STD00016');
      })
  }
}
