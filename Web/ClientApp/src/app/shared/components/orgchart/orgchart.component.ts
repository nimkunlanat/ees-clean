import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'orgchart',
  templateUrl: './orgchart.component.html',
  styleUrl: './orgchart.component.scss'
})
export class OrgchartComponent {
  selectedNodes!: TreeNode[];

  data: TreeNode[] = [
    {
      expanded: true,
      type: 'person',
      data: {
          image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
          name: 'Amy Elsner',
          title: 'CEO'
      },
      children: [
          {
              expanded: true,
              type: 'person',
              data: {
                  image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png',
                  name: 'Anna Fali',
                  title: 'CMO'
              },
              children: [
                  {
                      label: 'Sales'
                  },
                  {
                      label: 'Marketing'
                  }
              ]
          },
          {
              expanded: true,
              type: 'person',
              data: {
                  image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/stephenshaw.png',
                  name: 'Stephen Shaw',
                  title: 'CTO'
              },
              children: [
                  {
                      label: 'Development'
                  },
                  {
                      label: 'UI/UX Design'
                  }
              ]
          }
      ]
  }
  ]
}
