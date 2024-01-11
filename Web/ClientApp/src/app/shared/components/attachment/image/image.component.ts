import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, Optional, Self, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AttachmentType, Category } from '@app/shared/types/data.types';
import { BehaviorSubject, Observable, switchMap, concat, of, tap, map, finalize } from 'rxjs';
import { BaseFormField } from '../../base-form';
import { Content, ContentUploadService } from '../content-upload.service';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent extends BaseFormField {
  @Input() category!: Category;
  @Input() max = 25600;
  @Input() width?: number | string = 'auto';
  contentSub!: BehaviorSubject<any>;
  content!: Observable<Content | Partial<Content>>;
  uploading = false;
  progress?: number;
  errorMessages: { message: string, param?: any }[] = [];
  constructor(
    @Optional() @Self() override controlDir: NgControl,
    public cs: ContentUploadService) {
    super(controlDir);
    this.contentSub = new BehaviorSubject<any>(null);
    this.content = this.contentSub.pipe(
      switchMap((source: any) => {
        if (typeof (source) == "number")
          return concat(of({ path: 'assets/images/loading.svg', loading: true }), this.cs.getContent(source))
        if (typeof (source) == "object" && source && source['upload'])
          return this.upload(source.file);
        if (typeof (source) == "object" && source)
          return this.readFileAsync(source)
        return of({})
      })
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.contentSub.next(this.value);
    }
  }

  override writeValue(id?: number): void {
    this.value = id;
    this.contentSub.next(this.value);
  }

  validate(file) {
    this.errorMessages = [];
    let invalid = false;
    if (file['type'].split('/')[0] != 'image') {
      this.errorMessages.push({ message: 'message.STD00030' });
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
    let file = null;
    if (event instanceof FileList)
      file = event[0];
    else file = event.target.files[0];

    if (this.validate(file)) return;

    this.contentSub.next(file);
    this.uploading = true;
    this.contentSub.next({ file: file, upload: true });
    if ("target" in event) event.target.value = null;
  }

  upload(file) {
    this.uploading = true;
    return this.cs.upload(file, AttachmentType.Image, this.category).pipe(
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
          return content;
        }
        return {}
      }),
      finalize(() => {
        this.uploading = false
        this.onTouched();
      })
    )
  }

  remove() {
    this.contentSub.next(null);
    this.onChange(null);
  }

  private readFileAsync(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const observable = new Observable<Partial<Content>>(subscriber => {
      reader.onload = (e: any) => {
        const content = { id: null, path: e.target.result } as Partial<Content>
        subscriber.next(content);
        subscriber.complete();
      };
      reader.onerror = (error): void => {
        subscriber.error(error);
      }
    });
    return observable;
  }
}
