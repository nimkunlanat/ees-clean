import { Component } from '@angular/core';
import { teamManagement } from '@app/models/tm/teamManagement';
import { TreeNode } from 'primeng/api';
import { Tmdt01Service } from './tmdt01.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NotifyService } from '@app/core/services/notify.service';
import { RowState } from '@app/shared/types/data.types';

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

export class Tmdt01Component {
  teamManagements: teamManagement[] = []
  data: TreeNode[] = []
  saveUser: TreeNode[] = []
  teamData: TreeNode[] = []
  setDataTosave;
  constructor(
    private sv: Tmdt01Service,
    private activatedRoute: ActivatedRoute,
    private md: ModalService,
    private ms: NotifyService) {
    this.activatedRoute.data.subscribe(({ list, saveList }) => {
      if (saveList.length > 0) {
        this.teamManagements = saveList
        this.teamManagements.forEach(m => {
          let userModel: TreeNode = {};
          userModel['expanded'] = true;
          userModel['type'] = 'person'
          userModel['data'] = { image: '../../../../assets/layout/images/man_logo.png', userId: m.userId, name: m.firstnameTh + ' ' + m.lastnameTh, title: m.positionNameEn }
          userModel['children'] = []
          userModel['headUser'] = m.headUser
          this.saveUser.unshift(userModel);
        })
        this.splitChild();
      }

      if (list) {
        this.teamManagements = list
        this.teamManagements.map(m => {
          let check: any = {}
          check['expanded'] = true;
          check['type'] = 'person'
          check['children'] = []
          check['data'] = { image: '../../../../assets/layout/images/man_logo.png', name: m.firstnameTh + ' ' + m.lastnameTh, title: m.positionNameEn, userId: m.userId }
          this.data.unshift(check);
        })
      }

    })
  }

  childrenStorage: TreeNode[] = []
  noChild = []
  haveChild = []



  splitChild() {
    this.haveChild = this.saveUser.filter(f => f['headUser'] === null)
    this.noChild = this.saveUser.filter(f => f['headUser'] !== null)

    if (this.noChild.length > 0) this.findChildren(this.noChild);
    else if (this.haveChild.length > 0) this.findChildren(this.haveChild);
  }

  findChildren(data) {
    data.forEach((element) => {
      let check = this.noChild.filter(f => f['headUser'] === element.data.userId)
      if (check.length >= 0) {
        element.children = check;
        this.teamData.unshift(element)
      }
    })
    this.findHeader(this.haveChild);
  }

  findHeader(data) {
    data.forEach((element) => {
      let check = this.teamData.filter(f => f['headUser'] === element.data.userId)
      if (check.length > 0) {
        element.children = check
        this.teamData = [element]
      }
    })
  }

  save() {
    let data = []
    this.setDataTosave.map(m => {
      let dataObject = { userId: null, headUser: null, rowState: RowState.Add }
      dataObject.userId = m.data.userId
      dataObject.headUser = m.headUser || null
      data.push(dataObject)
    })
    this.sv.save(data).subscribe(() => {
      this.ms.success("message.STD00014")
   })

    // else if (this.setDataTosave.length == 1) {
    //   this.setDataTosave.map(m => {
    //     let dataObject = {userId : null, headUser : null ,rowState : RowState.Delete }
    //     dataObject.userId=m.data.userId
    //     dataObject.headUser = m.headUser || null 
    //     data.push(dataObject)
    //   })
    //   for (var i =0; i < this.setDataTosave[0].children.length; i++) {
    //     this.setDataTosave[0].children.map(m => {
    //       let dataObject = {userId : null, headUser : null ,rowState : RowState.Delete }
    //       dataObject.userId=m.data.userId
    //       dataObject.headUser = m.headUser || null 
    //       data.push(dataObject)
    //     })
    //   }
    //   this.sv.save(data).subscribe()
    // }
  }


  search(value?: string) {
    this.sv.list(value).subscribe((teamManagements: teamManagement[]) => this.teamManagements = teamManagements)
  }

  getTeam(event) {
    console.log(event)
    this.setDataTosave = event;
  }

}

