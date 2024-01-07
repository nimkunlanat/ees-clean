import { AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'datatable',
  templateUrl: './table.component.html'
})
export class TableComponent implements AfterContentInit {
  @Input() rows!: any[];
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];

  page: number = 10;
  @ContentChildren(PrimeTemplate)
  templates!: QueryList<any>;
  headerTemplate!: TemplateRef<any>;
  bodyTemplate!: TemplateRef<any>;
  captionTemplate!: TemplateRef<any>;
  summaryTemplate!: TemplateRef<any>;

  constructor() { }

  gePrimeTemplateByType(type: string): PrimeTemplate {
    return this.templates.find(template => {
      return template.getType() === type;
    });
  }

  ngAfterContentInit() {
    this.headerTemplate = this.gePrimeTemplateByType('header')?.template;
    this.bodyTemplate = this.gePrimeTemplateByType('body')?.template;
    this.captionTemplate = this.gePrimeTemplateByType('caption')?.template;
    this.summaryTemplate = this.gePrimeTemplateByType('summary')?.template;
  }
}
