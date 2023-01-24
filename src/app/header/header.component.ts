import { Component, HostBinding } from '@angular/core';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @HostBinding('class.cds--header') headerClass = true;

  constructor(public loginService: LoginService) {}

  ngOnInit() {
  }
}
