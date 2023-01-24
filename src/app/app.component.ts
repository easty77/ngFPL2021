import { Component  } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngFPL2021';

  constructor(
    public loginService: LoginService
  ) 
  {
    console.log(this.loginService.isLoggedIn());
  }
}
