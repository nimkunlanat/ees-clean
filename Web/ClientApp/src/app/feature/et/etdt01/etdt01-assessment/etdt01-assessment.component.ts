import { style } from "@angular/animations";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/core/authentication/auth.service";
import { NotifyService } from "@app/core/services/notify.service";
import { ModalService } from "@app/shared/components/modal/modal.service";
import { Etdt01Service } from "../etdt01.service";

@Component({
  selector: 'x-etdt01-assessment',
  templateUrl: './etdt01-assessment.component.html',
  styleUrl: './etdt01-assessment.component.scss'
})
export class Etdt01AssessmentComponent {
  form: FormGroup;
  status: any[];
  detailForm!: FormGroup;
  data: any = [];
  listAssessment: any = [];


  constructor(

    private fb: FormBuilder,
    private ms: NotifyService,
    private route: ActivatedRoute,
    private sv: Etdt01Service,
    private md: ModalService,
    private router: Router,
    private user : AuthService) {
    this.createForm()

    this.route.data.subscribe(({ Assessment }) => {
      this.data = Assessment.listAssessment
      this.status = Assessment.listAssessment.status
      this.listAssessment = Assessment.listAssessment.evaluates
      this.form.get('statusName').setValue(Assessment.params.status)
      this.listAssessment.map(m => {
        m['listDetail'] = Assessment.listAssessment.evaluateDetails.filter(f => m.evaluateGroupCode === f.evaluateGroupCode)
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
      dateFrom: [null],
      dateTo: [null],
      statusName:[null]
    })
  }

  createDetailForm(detailForm:any , index , point = null){
    let fg:FormGroup = this.fb.group({
      documentNo: [null],
      evaluateGroupCode: [null],
      evaluateDetailCode: [null],
      rowVersion: [null],
      rowState: [null]
    })
    fg.addControl('point'+index , new FormControl(null, [Validators.required]));
    if(point) fg.get('point'+index).setValue(point);
    fg.patchValue(detailForm);
    return fg;
  }

  rebuildData(headerData , point = null) {
    headerData.map((m , index) => {
      let data = point ? this.createDetailForm(m , index , point) : this.createDetailForm(m , index);
      m['form'] = data
      return m;
    })
  }

  getTotalWork(headerType = null , index = null){
    this.listAssessment.filter(f => f.evaluateGroupCode === headerType).map(m => {
      if(m['totalMemory']?.length === undefined) {
        m['totalMemory'] = [] as any[]
      }
      m.listDetail.map((lm,i) => {
        if(index === i){
          if(lm.form.get('point'+ index)?.value) {
              if(m['totalMemory'][index]) {
                m['totalMemory'][index] = Number(lm.form.get('point'+ index)?.value)
                m['totalPoints'] = m['totalMemory'].reduce((a , b) => a + b , 0) ?? m['totalMemory'][0]
              }else {
                m['totalMemory'][index] = Number(lm.form.get('point'+ index)?.value)
                m['totalPoints'] = m['totalMemory'].reduce((a , b) => a + b , 0) ?? m['totalMemory'][0]
              }
          }else {
              m['totalMemory'][index] = null
              m['totalPoints'] = m['totalMemory'].reduce((a , b) => a + b , 0) ?? m['totalMemory'][0]
            }
            return m
          }
      })
    });
  }

  validate = () => this.form.invalid;

  save() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
    }
    else {
      let data = [];
      this.listAssessment.map(m => {
        m.listDetail.map(lm => {
          data.push(lm.form.getRawValue());
        })
      })
      console.log(data);

      // this.sv.save(data).pipe(
      //   switchMap((res: any) => this.sv.detail(res.DocumentNo))
      // ).subscribe(res => {
      //   this.data = res
      //   this.data.rowState = RowState.Normal;
      //   this.form.patchValue(res)
      //   // this.rebuildData()
      //   this.ms.success("message.STD00014");
      // })
    }
  }

  search() {
    let dateFrom = this.form.get('dateFrom').value;
    let dateTo = this.form.get('dateTo').value;
    if(dateFrom && dateTo){
      this.sv.calculate(dateFrom,dateTo).subscribe((res:any) => {
        this.listAssessment.map(m => {
          if(m.evaluateGroupCode === 'Work'){
            for(let i = 0 ; i < m['listDetail'].length ; i++){
              if(i === 0) {
                m['listDetail'][i].form.get('point' + i).setValue(Number(res.calculateCode[0].calculate))
                m['listDetail'][i].form.get('point' + i).disable();
              }else {
                m['listDetail'][i].form.get('point' + i).setValue(Number(res.calculateQuality[0].quality));
                m['listDetail'][i].form.get('point' + i).disable();
              }
            }
          }
          return m
        })
        });
    }
  }

  next(){
    this.router.navigateByUrl('/et/etdt01/assessment/skill');
  }

  cancel(){
    this.router.navigateByUrl('et/etdt01');
  }

  get totalPoint() {
    let data: number = 0;
    this.listAssessment.map((m: any) => {
      if (m['totalPoints'] !== undefined) {
        data += Number(m['totalPoints']);
      }
    });
    return data.toFixed(2);
  }

  get grade(){
    let grade = "";
    let color = "";
    if(this.totalPoint >= '90'){
      grade = "A";
      color = "#25BF6C";
    }
    else if(this.totalPoint >= '80'){
      grade = "B";
      color = "#95B2EA";
    }
    else if(this.totalPoint >= '70'){
      grade = "C";
      color = "#E3DB34";
    }
    else if(this.totalPoint >= '50'){
      grade = "D";
      color = "#FFAF14";
    }
    else if(this.totalPoint  >= '1'){
      grade = "F";
      color = "#FF5050";
    }
    else{
      grade = "N";
      color = "#D9D9D9";
    }
    return { grade, color };
  }
}
