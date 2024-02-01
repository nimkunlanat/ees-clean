import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-etdt01',
  templateUrl: './etdt01.component.html',
  styleUrl: './etdt01.component.scss'
})
export class Etdt01Component {
  breadcrumbItems: MenuItem[] = [
    { label: 'label.ETDT01.AssessmentForm', routerLink: '/et/etdt01' },
    { label: 'label.ETDT01.SkillForm', routerLink: '/et/etdt01/etdt01-skill',},
  ];
}
