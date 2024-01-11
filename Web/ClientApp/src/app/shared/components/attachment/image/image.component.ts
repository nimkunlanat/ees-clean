import { Component, Input, Optional, Self } from '@angular/core';
import { BaseFormField } from '../../base-form';
import { Observable, filter, finalize, map } from 'rxjs';
import { Content, ContentUploadService } from '../content-upload.service';
import { AttachmentType, Category } from '@app/shared/types/data.types';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent extends BaseFormField {

  @Input() category: Category;

  constructor(@Optional() @Self() override controlDir: NgControl, public cs: ContentUploadService) {
    super(controlDir)
  }

  override writeValue(value: number): void {
    this.value = value
  }

  add(event: Event) {
    const file = event.target["files"][0]
    this.cs.upload(file, AttachmentType.File, this.category).pipe(
      filter(f => f["path"])
    ).subscribe((res: Content) => {
      this.value = res.id
      this.onChange(this.value)
    })
  }
}