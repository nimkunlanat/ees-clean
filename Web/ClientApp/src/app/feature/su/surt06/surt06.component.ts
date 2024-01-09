import { Component, OnInit } from '@angular/core';
import { Parameter } from '@app/models/su/parameter';
import { Surt06Service } from './surt06.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'x-surt06',
  templateUrl: './surt06.component.html',
  styleUrl: './surt06.component.scss'
})
export class Surt06Component implements OnInit{

  parameters : Parameter[] = []

  constructor(
    private sv: Surt06Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({ parameters }) => this.parameters = parameters)
  }

  ngOnInit(): void {
      this.search();
  }

  search(value: string = '') {
    this.sv.list(value).subscribe((parameters: Parameter[]) => {
      this.parameters = parameters
    })
  }

  delete(parameterGroupCode: string) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm), 
      switchMap(() => this.sv.delete(parameterGroupCode)))
      .subscribe((res: any) => {
        this.search()
        this.ms.success('message.STD00016');
      })
  }
}

