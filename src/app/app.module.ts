import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BlockchainListComponent } from './blockchain/blockchain-list/blockchain-list.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';
import { IconDefinition } from '@ant-design/icons-angular';
import { FileTextOutline, ToolOutline, ShareAltOutline, MailOutline, GooglePlusOutline, FacebookFill, LinkedinFill, TwitterOutline, HeartOutline, MediumSquareFill, GithubOutline } from '@ant-design/icons-angular/icons';

registerLocaleData(en);

const icons: IconDefinition[] = [ FileTextOutline, ToolOutline, ShareAltOutline, MailOutline, GooglePlusOutline, FacebookFill, LinkedinFill, TwitterOutline, HeartOutline, MediumSquareFill, GithubOutline ];

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    BlockchainListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    NzButtonModule,
    NzAlertModule,
    NzSpinModule,
    AuthModule,
    NzIconModule.forRoot(icons)
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
