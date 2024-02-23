import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalService } from "@app/shared/components/modal/modal.service";
import { MenuItem, SelectItem } from "primeng/api";
import { Etdt01Service } from "../etdt01.service";

@Component({
  selector: 'x-etdt01-assessment',
  templateUrl: './etdt01-assessment.component.html',
  styleUrl: './etdt01-assessment.component.scss'
})
export class Etdt01AssessmentComponent {
  form: FormGroup;
  status: any[] = ['เลือกสถานะ', 'กำลังดำเนินการ', 'เสร็จสิ้น', 'ยกเลิก'];
  detailForm!: FormGroup;
  data: any = [];
  list: any = [];
  items: SelectItem[] = []

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sv: Etdt01Service,
    private md: ModalService,
    private router: Router) {
    this.createForm()
    this.route.data.subscribe(({ Assessment }) => {
      this.status
      console.log(this.status);

      this.data = Assessment
      this.list = Assessment.evaluates
      this.list.map(m => {
        m['listDetail'] = Assessment.evaluateDetails.filter(f => m.evaluateGroupCode === f.evaluateGroupCode)
        this.rebuildData(m['listDetail'])
        return m
      })
    })
  }

  createForm() {
    this.form = this.fb.group({
      employeeCode: [null],
      firstname: [null],
      surname: [null],
      position: [null],
      email: [null],
    })

    // let data;
    // data.form = this.form
  }

  createDetailForm(detailForm:any , index){
    let fg:FormGroup = this.fb.group({
        documentNo:null,
        evaluateGroupCode : null,
        evaluateDetailCode:null,
        rowVersion:null,
        rowState:null
    })
    fg.addControl('point'+index , new FormControl(null));
    fg.patchValue(detailForm);
    return fg;
  }

  rebuildData(headerData) {
    headerData.map((m , index) => {
      let data = this.createDetailForm(m , index);
      m['form'] = data
      return m;
    })
  }

  getTotalWork(headerType){
    this.list.filter(f => f.evaluateGroupCode === headerType).map(m => {
      console.log(m.listDetail)
      m.listDetail.map(lm => {
        m['totalPoints'] = Number(0);
        for(let i = 0 ; i <= 10; i++){
          if(lm.form.get('point'+ i)?.value) m['totalPoints'] += Number(lm.form.get('point'+ i)?.value);
          else {
            break;
          };
        }
        return m
      })
    });
  }

  next(){
    this.router.navigateByUrl('/et/etdt01/assessment/skill');
  }

  cancel(){
    this.router.navigateByUrl('et/etdt01');
  }
}

