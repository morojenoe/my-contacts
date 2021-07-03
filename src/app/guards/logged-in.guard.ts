import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const mustBeLoggedIn = route.data?.mustBeLoggedIn;
      const isLoggedIn = this.authService.isLoggedIn();
      if (isLoggedIn === mustBeLoggedIn) {
        return true;
      }
      if (!isLoggedIn) {
        return this.router.createUrlTree(['/login']);
      }
      return false;
  }
  
}
