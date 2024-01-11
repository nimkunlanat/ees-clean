import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AttachmentType, Category } from '@app/shared/types/data.types';
import { BehaviorSubject, Observable, switchMap, of, tap, map, finalize } from 'rxjs';
import { BaseFormField } from '../../base-form';
import { Content, ContentUploadService } from '../content-upload.service';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent extends BaseFormField {
  @Input() category!: Category;
  @Input() max = 25600; //25MB => 25600KB
  @Input() disable: boolean = false;
  @Input() accept: string = '*'
  @Output() fileData = new EventEmitter();

  contentSub!: BehaviorSubject<any>;
  content!: Observable<Content | Partial<Content>>;
  uploading = false;
  progress?: number;
  errorMessages: { message: string, param?: any }[] = [];
  constructor(@Optional() @Self() override controlDir: NgControl,
    public cs: ContentUploadService) {
    super(controlDir);
    this.contentSub = new BehaviorSubject<any>(null);
    this.content = this.contentSub.pipe(
      switchMap((source: any) => {
        if (typeof (source) == "number")
          return this.cs.getContent(source)
        if (typeof (source) == "object" && source && source['upload'])
          return this.upload(source.file);
        if (typeof (source) == "string")
          return of({ name: source } as Partial<Content>)
        return of({} as Partial<Content>)
      })
    )
  }

  override writeValue(id?: number): void {
    this.value = id;
    this.contentSub.next(this.value);
  }

  validate(file) {
    this.errorMessages = [];
    let invalid = false;

    const acceptTypes = this.accept.split(",");
    const accpetTypeRegex = acceptTypes.map(type => "\\" + type).join('|')
    const type = file.name;
    let regex = new RegExp(`(${accpetTypeRegex})$`);

    if (acceptTypes.length > 0 && !regex.exec(type)) {
      this.errorMessages.push({ message: 'message.STD00033', param: { type: this.accept } });
      invalid = true;
    }
    if (file.size === 0) {
      this.errorMessages.push({ message: 'message.STD00031' });
      invalid = true;
    }
    if (Math.round((file.size / 1024)) > this.max) {
      this.errorMessages.push({ message: 'message.STD00032', param: { max: this.max / 1024 } });
      invalid = true;
    }
    return invalid;
  }

  add(event) {
    if (event.target.files.length === 0) {
      return;
    }
    this.remove();
    const file = event.target.files[0];
    if (this.validate(file)) {
      event.target.value = null;
      return;
    }

    this.contentSub.next(file.name);
    this.contentSub.next({ file: file, upload: true })
    event.target.value = null;
  }

  upload(file) {
    this.uploading = true;
    return this.cs.upload(file, AttachmentType.File, this.category).pipe(
      tap(event => {
        if (!("path" in event)) {
          const contentEvent = (event as HttpEvent<Content>)
          if (contentEvent.type == HttpEventType.UploadProgress) {
            this.progress = Math.round(contentEvent.loaded / contentEvent.total * 100);
          }
        }
      }),
      map(event => {
        if (("path" in event)) {
          const content = event as Content;
          this.value = content.id;
          this.onChange(this.value);
          this.fileData.emit(content);
          return content;
        }
        return { name: 'uploading...' }
      }),
      finalize(() => {
        this.uploading = false
        this.onTouched();
      })
    )
  }

  remove() {
    this.value = null;
    this.contentSub.next(this.value);
    this.onChange(this.value);
  }

  open(path) {
    window.open(path, '_blank', 'noreferrer')
  }
}
