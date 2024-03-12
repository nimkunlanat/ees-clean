import { style } from "@angular/animations";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/core/authentication/auth.service";
import { NotifyService } from "@app/core/services/notify.service";
import { Approve } from "@app/models/et/approve";
import { DocumentApproved } from "@app/models/et/documentApproved";
import { ModalService } from "@app/shared/components/modal/modal.service";
import { RowState } from "@app/shared/types/data.types";
import { Guid } from "guid-typescript";
import { switchMap } from "rxjs";
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

    this.route.data.subscribe(({ Assessment, etdt01master }) => {
      this.data = Assessment.listAssessment
      this.status = etdt01master.status
      this.listAssessment = Assessment.listAssessment.evaluates

      if (this.data && ('evaluationStatus' in this.data) && this.data.evaluationStatus !== null) {
        this.form.get('statusName').setValue(this.data.evaluationStatus);
      } else {
        this.form.get('statusName').setValue('93c5ef90-28f5-4197-8775-f8a009ca06bf');
      }
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
      statusName:[null],
    })
  }

  createDetailForm(detailForm:any , index , point = null){
    let fg:FormGroup = this.fb.group({
      documentNo: [null],
      documentDetailNo: [null],
      evaluateGroupCode: [null],
      evaluateDetailCode: [null],
      rowState: [null],
      rowVersion: [null],
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

  rebuildForm() {
    if (this.data) {
      this.form.controls["rowState"].setValue(RowState.Normal);
      this.detailForm.controls['rowState'].setValue(RowState.Normal);
    } else {
      this.form.controls["rowState"].setValue(RowState.Add);
      this.detailForm.controls["rowState"].setValue(RowState.Add);
    }
    this.form.valueChanges.subscribe(() => {
      if (this.form.controls['documentNo'].value) {
        this.form.controls['rowState'].setValue(RowState.Edit);
        this.detailForm.controls['rowState'].setValue(RowState.Edit);
      }
      else if (this.form.controls['rowState'].value === RowState.Normal) {
        this.form.controls['rowState'].setValue(RowState.Edit);
        this.detailForm.controls['rowState'].setValue(RowState.Edit);
      }
    });
    this.form.markAsPristine();
  }

  save() {
    if (this.validate()) {
      this.ms.warning("message.STD00013");
      this.form.markAllAsTouched();
    } else {
      let docApprove = new DocumentApproved();
      this.data.evaluationStatus = 'eb801ae2-788d-45dd-b869-9d9e39e67deb';
      docApprove.employeeCode = this.data.employeeCode;
      docApprove.documentNo = this.data.documentNo ?? this.data.guid;
      docApprove.evaluationStatus = this.data.evaluationStatus

      if (this.data.documentNo) {
        docApprove.rowState = RowState.Edit;
      } else {
        docApprove.rowState = RowState.Add;
      }

      this.listAssessment.forEach(assessment => {
        assessment.listDetail.forEach(detail => {
          const data = detail.form.getRawValue()
          if(this.data.documentNo){
            data.rowState = RowState.Edit;
          }
          else {
            data.rowState = RowState.Add;
          }
          docApprove.documentapprovedDetails.push(data);
        });
      });

      if (docApprove.documentapprovedDetails.length > 0) {
        docApprove.documentapprovedDetails.map((m , index) => {
          for(let i = 0 ; true ; i++){
            if(m['point'+i] !==  undefined)
            {
              m['point'] = m['point'+i]
              break;
            }
          }
        })
        this.sv.save(docApprove).pipe(

          switchMap((res: DocumentApproved) => this.sv.listAssessment(res.documentNo))
          ).subscribe((res: DocumentApproved[]) => {
          console.log(res);
          this.data = res;
          this.data.rowState = RowState.Normal;
          this.form.patchValue(res);
          this.rebuildForm();
          this.ms.success("message.STD00014");
        });
      }
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

  next(documentNo?: Guid){
    this.router.navigate(['/et/etdt01/assessment/skill'], { state: { documentNo: documentNo }});
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
    let numericTotalPoint = parseFloat(this.totalPoint); // แปลงเป็นตัวเลข

    if(numericTotalPoint >= 90){
      grade = "A";
      color = "#25BF6C";
    }
    else if(numericTotalPoint >= 80){
      grade = "B";
      color = "#95B2EA";
    }
    else if(numericTotalPoint >= 70){
      grade = "C";
      color = "#E3DB34";
    }
    else if(numericTotalPoint >= 50){
      grade = "D";
      color = "#FFAF14";
    }
    else if(numericTotalPoint >= 0.01){
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
