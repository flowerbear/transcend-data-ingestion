import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'td-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

  year: any = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
  }

}
