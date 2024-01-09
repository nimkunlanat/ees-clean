import { ResolveFn } from '@angular/router';
import { Surt06Service } from './surt06.service';
import { Parameter } from '@app/models/su/parameter';
import { inject } from '@angular/core';

export const list: ResolveFn<Parameter[]> = (route, state) => inject(Surt06Service).list();
