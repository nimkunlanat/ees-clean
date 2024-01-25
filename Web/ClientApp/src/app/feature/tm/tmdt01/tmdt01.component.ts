import { Component } from '@angular/core';
import { teamManagement } from '@app/models/tm/teamManagement';
import { TreeNode } from 'primeng/api';
import { Tmdt01Service } from './tmdt01.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'x-tmdt01',
  templateUrl: './tmdt01.component.html',
})

// {
//   expanded: true,
//   type: 'person',
//   data: {
//     image: '../../../../assets/layout/images/man_logo.png',
//     name: 'Anuwat',
//     title: 'Project Manager',
//   },
//   children: [],
// },

export class Tmdt01Component{
  teamManagements: teamManagement[] = []
  data:TreeNode[] = []
  setDataTosave;
  constructor(
    private sv: Tmdt01Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) 
    {
    this.activatedRoute.data.subscribe(({ list }) => {
      this.teamManagements = list
      this.teamManagements.map(m => {
        let check:any = {}
        check['expanded'] = true;
        check['type'] = 'person'
        check['children'] = []
        check['data'] = {image : '../../../../assets/layout/images/man_logo.png' , name: m.firstnameTh + ' ' + m.lastnameTh , title: m.positionNameEn, userId: m.userId}
        this.data.unshift(check);
      })
    })
  }

  save() {
    console.log("ililhiiii",this.setDataTosave)
  }


  search(value?: string) {
    this.sv.list(value).subscribe((teamManagements: teamManagement[]) => this.teamManagements = teamManagements)
  }

  getTeam(event){ 
    // console.log(event)
    this.setDataTosave = event;
  }

}

