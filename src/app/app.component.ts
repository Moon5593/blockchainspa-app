import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { ErrorService } from './error/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'BlockchainSPAApp';

  isLoginPage:boolean = true;
  hasError = false;
  private errorSub: Subscription;
  message: string;
  userIsAuthenticated = false;

  constructor(private bService: BlockchainService, private authService: AuthService, private errorService: ErrorService){}

  ngOnInit(){
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.bService.logout.subscribe(response=>{
      setTimeout(() => {
        this.isLoginPage = response;
      }, 0);
    });

    this.errorSub = this.errorService.getErrorListener().subscribe(
      message => {
        this.hasError = message !== null;
        this.message = message;
      }
    );
  }

  onLogout() {
    this.isLoginPage = true;
    this.authService.logout();
    this.userIsAuthenticated = this.authService.getIsAuth();
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }

}
