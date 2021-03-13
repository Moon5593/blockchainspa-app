import { Component, Input, OnDestroy, OnInit } from "@angular/core";

@Component({
  templateUrl: "./error.component.html",
  selector: "app-error",
})
export class ErrorComponent implements OnInit{
  @Input() data: string;
  constructor() {}

  ngOnInit(){}
}
