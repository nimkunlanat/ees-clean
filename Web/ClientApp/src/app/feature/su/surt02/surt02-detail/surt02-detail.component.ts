import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Master, MenuDTO, Surt02Service } from '../surt02.service';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { RowState } from '@app/shared/types/data.types';
import { Observable, of, switchMap } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-surt02-detail',
  templateUrl: './surt02-detail.component.html',
  styles: ``
})
export class Surt02DetailComponent {

  form: FormGroup;
  master: Master;
  menu: MenuDTO;
  parameter: { menuCode: string }
  breadcrumbItems: MenuItem[] = [
    { label: 'label.SURT02.ProgramName', routerLink: '/su/surt02' },
    { label: 'label.SURT02.Detail', routerLink: '/su/surt02/detail' },
  ]

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ms: NotifyService,
    private sv: Surt02Service,
    private md: ModalService) {
    this.createForm()
    this.route.data.subscribe(({ menu, master }) => {
      this.menu = menu ?? new MenuDTO()
      this.master = master
      this.rebuildData()
    })
  }

  rebuildData() {
    this.form.patchValue(this.menu)
    if (this.menu.menuCode) {
      this.form.controls["menuCode"].disable();
      this.form.controls["rowState"].setValue(RowState.Normal);
    }
    else {
      this.form.controls["rowState"].setValue(RowState.Add);
      this.form.controls["active"].setValue(true);
    }

    this.form.valueChanges.subscribe(() => {
      if (this.form.controls['rowState'].value == RowState.Normal) this.form.controls['rowState'].setValue(RowState.Edit);
    })

    this.form.markAsPristine()
  }

  createForm() {
    this.form = this.fb.group({
      menuCode: [null, [Validators.required, Validators.maxLength(20)]],
      mainMenu: null,
      programCode: null,
      icon: [null, [Validators.maxLength(20)]],
      menuNameTH: [null, [Validators.required, Validators.maxLength(200)]],
      menuNameEN: [null, [Validators.required, Validators.maxLength(200)]],
      active: [null],
      rowState: null,
      rowVersion: null,
      systemCode: "ccs"
    })
  }

  validate = () => this.form.invalid;

  save() {
    if (this.validate()) {
      this.ms.warning('message.STD00013');
      this.form.markAllAsTouched();
    }
    else {
      this.sv.save(this.form.getRawValue()).pipe(
        switchMap((res: any) => this.sv.detail(res.menuCode))
      ).subscribe((res) => {
        this.menu = res;
        this.rebuildData();
        this.ms.success("message.STD00014");
      })
    }
  }

  canDeactivate(): Observable<boolean> {
    if (this.form.dirty) return this.md.confirm("message.STD00010");
    return of(true);
  }
}
