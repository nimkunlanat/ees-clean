import { ResolveFn } from '@angular/router';

export const list: ResolveFn<boolean> = (route, state) => {
  return true;
};
