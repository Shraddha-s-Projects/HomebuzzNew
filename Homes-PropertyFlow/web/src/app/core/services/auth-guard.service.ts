import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Injectable()
export class AuthGuard implements CanActivate {
    public isUserExist: boolean;
    constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
        private cookieService: CookieService, private router: Router) {
        this.isUserExist = this.cookieService.check("user");
    }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.isUserExist) {
            const roles = route.data['roles'] as Array<string>;
            //Role base check
            if ((roles == null || roles.indexOf(this.cookieService.get("rolename")) === -1)) {
                this.router.navigate(['login']);
                // console.log('call 2 if login');
                return false;
            } else {
                // console.log('call true');
                return true;
            }
        } else {
            // console.log('call 1 else login');
            this.router.navigate(['login']);
            return false;
        }
    }
}
// export class AuthGuard implements CanActivate {

//   constructor(private auth: AuthService, private router: Router) { }

//   canActivate(route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {
//     if (this.auth.loggedIn()) {
//       //Role base check
//       // let roles = route.data["roles"] as Array<string>;
//       // if((roles == null || roles.indexOf(localStorage.getItem("role")) == -1)){
//       //    this.router.navigate(['login']);
//       //   return false;
//       // }
//       // else{
//       //   return true;
//       // }
//       return true;
//     }
//     else {
//       this.router.navigate(['login']);
//       return false;
//     }
//   }
// }