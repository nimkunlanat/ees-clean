import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'x-attachment',
  templateUrl: './attachment.component.html',
  styles: ``
})
export class AttachmentComponent {
  form: FormGroup = new FormGroup({
    i: new FormControl(null, Validators.required),
    j: new FormControl(null, Validators.required)
  })
}
