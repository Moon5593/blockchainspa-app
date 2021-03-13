import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthRoutingModule } from "./auth-routing.module";

import { IconDefinition } from '@ant-design/icons-angular';
import { LockOutline, UserOutline } from '@ant-design/icons-angular/icons';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const icons: IconDefinition[] = [ LockOutline, UserOutline ];

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, FormsModule, AuthRoutingModule, ReactiveFormsModule, NzFormModule, NzIconModule.forChild(icons), NzInputModule, NzButtonModule, NzAlertModule, NzSpinModule]
})
export class AuthModule {}
