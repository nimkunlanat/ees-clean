import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Content as ContentModel } from '@app/models/su/content'
import { ParameterService } from '@app/shared/services/parameter.service';
import { AttachmentType, Category } from '@app/shared/types/data.types';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

export interface Content extends ContentModel {
  loading?: boolean;
}

export interface ContentPath {
  DisplayUrl: string,
  ApiUrl: string,
}

@Injectable({
  providedIn: 'root'
})
export class ContentUploadService {

  constructor(private http: HttpClient, private ps: ParameterService) { }

  getContentUrl(): Observable<ContentPath> {
    return this.ps.getParameter('ContentPath');
  }

  getContent(id) {
    return this.getContentUrl().pipe(
      switchMap(path => this.http.disableApiPrefix().skipErrorHandler().disableLoading().get<Content>(`${path.ApiUrl}/api/content`, { params: { id: id } }).pipe(
        map(content => {
          content.path = `${path.DisplayUrl}/${content.container}/${content.path}`
          return content;
        })
      )),
      catchError(() => {
        return of({} as Content)
      })
    )
  }

  upload(file: File, type: AttachmentType, category: Category): Observable<Content | HttpEvent<Content>> {
    var formData: any = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("category", category || Category.Defalt);
    return this.getContentUrl().pipe(
      switchMap(path => this.http.disableApiPrefix().skipErrorHandler().disableLoading().post<Content>(`${path.ApiUrl}/api/content`, formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        map(event => {
          if (event.type == HttpEventType.Response) {
            const content = event.body;
            content.path = `${path.DisplayUrl}/${content.container}/${content.path}`
            return content;
          }
          return event;
        })
      ))
    )
  }
}
