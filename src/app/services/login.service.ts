import { Injectable } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user! : SocialUser;

  constructor(private socialAuthService: SocialAuthService) {
    this.socialAuthService.authState.subscribe((user) => {
      // user = null on logout
      this.user = user;
      });
  
   }
  ngOnInit() {
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.socialAuthService.signOut();
  }
  isLoggedIn(): boolean {
    return this.user !== undefined && this.user !== null;
  }
  getName(): string | undefined {
    if(this.user !== undefined && this.user !== null) {
      return this.user.name;
    }
    return undefined;
  }
  getEmail(): string | undefined {
    if(this.user !== undefined && this.user !== null) {
      return this.user.email;
    }
    return undefined;
  }
  getPicture(): string | undefined {
    if(this.user !== undefined && this.user !== null) {
      return this.user.photoUrl + "&access_token=" + this.user.authToken;
    }
    return undefined;
  }
  getInitials(): string | undefined {
    if(this.user !== undefined && this.user !== null) {
      return this.user.firstName[0] + this.user.lastName[0] ;
    }
    return undefined;
  }
}
