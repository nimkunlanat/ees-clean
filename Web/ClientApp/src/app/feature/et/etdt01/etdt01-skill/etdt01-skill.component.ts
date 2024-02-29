import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-etdt01-skill',
  templateUrl: './etdt01-skill.component.html',
  styleUrl: './etdt01-skill.component.scss'
})
export class Etdt01SkillComponent {
  status: any[]
  data: any = [];
  listSkills: any = [];
  listSkillsDetails: any = [];
  filterSkill:any[] = [];
  filterSkillDetails:any[] = [];
  selectedGrade: string = '';

  constructor(
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute,) {
    this.route.data.subscribe(({ Skillmatrix }) => {
    this.status = Skillmatrix.status
    this.data = Skillmatrix
    this.listSkills = Skillmatrix.skills
    this.listSkillsDetails = Skillmatrix.skillDetails

    this.listSkills.map(m => {
        let check = this.filterSkill.filter(f => f.headerName === m.subjectGroup);
        let groupItemsFromSkills = this.listSkills.filter(f => f.subjectGroup === m.subjectGroup);
        m['groupItems'] = groupItemsFromSkills;
        m['groupItems'].map(m => m['groupItemsDetail'] = this.listSkillsDetails?.filter(f => f.subjectId === m.subjectId).map(m => {
          m['label'] = m.description
          m['value'] = m.score
        // console.log(this.listSkillsDetails);
          return m
        }))
        if (check.length === 0) {
          this.filterSkill.push({ headerName: m.subjectGroup, groupItems: m['groupItems'] });
        }
        return m;
      });
    })
  }


  radiochange(event , item){
    this.filterSkill.map(m => {
      item['score'] = event
      return m;
    })
  }

  getGrade(score) {
    const numericScore = parseFloat(score);
    if (!isNaN(numericScore)) {
        if (numericScore == 5) {
            return 'A';
        } else if (numericScore == 4) {
            return 'B';
        } else if (numericScore == 3) {
            return 'C';
        } else if (numericScore == 2) {
            return 'D';
        } else {
            return 'N';
        }
    } else {
        return 'N'; // ค่าเริ่มต้นสำหรับคะแนนที่ไม่ถูกต้อง
    }
}
  getBackgroundColor(score) {
    const numericScore = parseFloat(score);
    if (!isNaN(numericScore)) {
        if (numericScore == 5) {
            return '#25BF6C'; // A
        } else if (numericScore == 4) {
            return '#95B2EA'; // B
        } else if (numericScore == 3) {
            return '#E3DB34'; // C
        } else if (numericScore == 2) {
            return '#FFAF14'; // D
        } else {
            return '#D9D9D9'; // N
        }
    } else {
        return '#D9D9D9'; // N
    }
}


  next(){
    this.router.navigateByUrl('/et/etdt01/assessment');
  }

  cancel(){
    this.router.navigateByUrl('et/etdt01');
  }
}
