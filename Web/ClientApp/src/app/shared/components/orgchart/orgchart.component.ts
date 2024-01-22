import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'orgchart',
  templateUrl: './orgchart.component.html',
  styleUrl: './orgchart.component.scss'
})
export class OrgchartComponent implements OnInit , OnChanges{
  selectedNodes!: TreeNode[];
  dragedEmployee:TreeNode;
  @Input() data: TreeNode[] = [
//     {
//       expanded: true,
//       type: 'person',
//       data: {
//           image: '../../../../assets/layout/images/man_logo.png',
//           name: 'Anuwat',
//           title: 'Project Manager'
//       },
//       children: [
//           {
//               expanded: true,
//               type: 'person',
//               data: {
//                   image: '../../../../assets/layout/images/man_logo.png',
//                   name: 'Phasit',
//                   title: 'System Analysis'
//               },
//               children: [
//                 {
//                     expanded: true,
//                     type: 'person',
//                     data: {
//                         image: '../../../../assets/layout/images/man_logo.png',
//                         name: 'Nattaphong',
//                         title: 'Software Developer'
//                     },
//                     children: []
//                 },
//                 {
//                     expanded: true,
//                     type: 'person',
//                     data: {
//                         image: '../../../../assets/layout/images/women_logo.png',
//                         name: 'Chayutra',
//                         title: 'Software Developer'
//                     },
//                     children: []
//                 },
//                 {
//                     expanded: true,
//                     type: 'person',
//                     data: {
//                         image: '../../../../assets/layout/images/man_logo.png',
//                         name: 'Nattanon',
//                         title: 'Software Developer'
//                     },
//                     children: []
//                 },
//                 {
//                     expanded: true,
//                     type: 'person',
//                     data: {
//                         image: '../../../../assets/layout/images/man_logo.png',
//                         name: 'Kitsakron',
//                         title: 'Software Developer'
//                     },
//                     children: []
//                 },
//               ]
//           },
//           {
//               expanded: true,
//               type: 'person',
//               data: {
//                   image: '../../../../assets/layout/images/man_logo.png',
//                   name: 'Jakarin',
//                   title: 'System Analysis'
//               },
//               children: [
//                 {
//                     expanded: true,
//                     type: 'person',
//                     data: {
//                         image: '../../../../assets/layout/images/women_logo.png',
//                         name: 'Sangnapha',
//                         title: 'Software Developer'
//                     },
//                     children: [
                        
//                     ]
//                 },
//               ]
//           }
//       ]
//   }
  ]
  employees = [
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/man_logo.png',
        name: 'Anuwat',
        title: 'Project Manager',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/women_logo.png',
        name: 'Sangnapha',
        title: 'Software Developer',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/man_logo.png',
        name: 'Jakarin',
        title: 'System Analysis',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/man_logo.png',
        name: 'Nattaphong',
        title: 'Software Developer',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/women_logo.png',
        name: 'Chayutra',
        title: 'Software Developer',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/man_logo.png',
        name: 'Nattanon',
        title: 'Software Developer',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/man_logo.png',
        name: 'Kitsakron',
        title: 'Software Developer',
      },
      children: [],
    },
    {
      expanded: true,
      type: 'person',
      data: {
        image: '../../../../assets/layout/images/man_logo.png',
        name: 'Phasit',
        title: 'System Analysis',
      },
      children: [],
    },
  ]
ngOnInit(): void {
    this.checkData(this.data)
}

ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
}

  dragStart(event){
    this.dragedEmployee = event
  }

  dragEnd(event){
    
  }

  drop(event:TreeNode = null){
    if(event){
        this.checkData(this.data)
        event.children.unshift(this.dragedEmployee)
        if(this.dragedEmployee != null) this.employees = this.employees.filter(f => f.data.name != this.dragedEmployee.data.name)
    }else if(this.data.length == 0){
        this.data.push(this.dragedEmployee)
        if(this.dragedEmployee != null) this.employees = this.employees.filter(f => f.data.name != this.dragedEmployee.data.name)
    }
    this.dragedEmployee = null;
  }

  checkData(data){
    data.forEach((element) => {
        if(element?.children?.length > 0) {
            if(element.children.filter(f=> f.data.name === this.dragedEmployee?.data?.name)){
                element.children = element.children.filter(f => f.data.name !== this.dragedEmployee.data.name)
            }
            this.checkData(element.children)
        }
    })
  }
}
