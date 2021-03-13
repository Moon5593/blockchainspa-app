import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockchainService } from "src/app/blockchain/blockchain.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  validateForm!: FormGroup;

  constructor(public authService: AuthService, private fb: FormBuilder, private blockchainService: BlockchainService) {}

  ngOnInit() {
    this.blockchainService.logout.next(true);

    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.validateForm.value.email, this.validateForm.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
