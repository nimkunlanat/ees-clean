import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '@app/layout/service/layout.service';
import { Etdt02Service } from './etdt02.service';
import { ActivatedRoute } from '@angular/router';
import { Approve } from '@app/models/et/approve';

@Component({
  selector: 'x-etdt02',
  templateUrl: './etdt02.component.html',
})

export class Etdt02Component implements OnInit, OnDestroy {

  Approves: Approve[] = [];
  assessment: string;
  subscription: Subscription;

  pieData1: any;
  pieOptions1: any;
  pieData2: any;
  pieOptions2: any;

  constructor(
    private layoutService: LayoutService,
    private sv: Etdt02Service,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.data.subscribe(({ documentApproves }) => this.Approves = documentApproves)
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe((config) => {
        this.initCharts();
      });
  }
  ngOnInit() {
    this.initCharts();
  }
  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    const evaluatedPie1 = this.Approves[0] != null ? this.Approves[0].evaluated : 0
    const notEvaluatedPie1 = this.Approves[0] != null ? this.Approves[0].notEvaluated : 0
    const evaluatedPie2 = this.Approves[1] != null ? this.Approves[1].evaluated : 0
    const notEvaluatedPie2 = this.Approves[1] != null ? this.Approves[1].notEvaluated : 0

    this.pieData1 = {
      labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
      datasets: [
        {
          data: [evaluatedPie1, notEvaluatedPie1],
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--teal-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--indigo-400'),
            documentStyle.getPropertyValue('--teal-400')
          ]
        }
      ]
    };
    this.pieOptions1 = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.pieData2 = {
      labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
      datasets: [
        {
          data: [evaluatedPie2, notEvaluatedPie2],
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--teal-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--indigo-400'),
            documentStyle.getPropertyValue('--teal-400')
          ]
        }
      ]
    };
    this.pieOptions2 = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
