import { Component } from '@angular/core';
import { Surt08Service } from './surt08.service';
import { ActivatedRoute } from '@angular/router';
import { ActivityLog } from '@app/models/su/activityLog';
import { map } from 'rxjs';

@Component({
  selector: 'x-surt08',
  templateUrl: './surt08.component.html',
  styles: ``
})
export class Surt08Component {
  activityLogs: ActivityLog[] = []

  constructor(
    private sv: Surt08Service,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe(({ activityLogs }) => this.activityLogs = activityLogs)
  }

  search(value: string = '') {
    this.sv.list(value).pipe(map((activityLogs: ActivityLog[]) => {
      return activityLogs.map(m => {
        if (["2001", "2002", "2003", "2004", "2005", "5000"].includes(m.activityTypeCode)) {
          m.logMessage = JSON.parse(m.logMessage)
        }
  
        return m
      })
    })).subscribe((activityLogs: ActivityLog[]) => this.activityLogs = activityLogs)
  }
}
