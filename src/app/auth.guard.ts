import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  if(localStorage("accessToken")){
    return true;
  }
  return false;
};
