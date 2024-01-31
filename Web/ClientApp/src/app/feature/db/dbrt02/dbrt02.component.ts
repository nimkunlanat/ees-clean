import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '@app/models/db/employee';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbrt02Service } from './dbrt02.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'x-dbrt02',
  templateUrl: './dbrt02.component.html',
  styleUrl: './dbrt02.component.scss'
})

export class Dbrt02Component {

  employees : Employee[] = []

  constructor(
    private sv: Dbrt02Service,
    private md: ModalService,
    private ms: NotifyService,
    private activatedRoute: ActivatedRoute,)
  {this.activatedRoute.data.subscribe(({ employees }) =>{
    console.log(employees)
    this.employees = employees
  })

}

search(value?: string) {
  this.sv.list(value).subscribe((employees: Employee[]) => this.employees = employees)
}

  delete(employeeCode: string) {
    this.md.confirm('message.STD00015').pipe(
      filter(confirm => confirm),
      switchMap(() => this.sv.delete(employeeCode)))
      .subscribe((res: any) => {
        this.search()
        this.ms.success('message.STD00016');
      })
}

}
