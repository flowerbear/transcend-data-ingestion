import { Component, OnInit } from '@angular/core';
import { StepState } from '@covalent/core/steps';
import { TdMediaService } from '@covalent/core/media';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent implements OnInit {

  active: boolean = false;
  disabled: boolean = false;
  state: StepState = StepState.Required; // or state: string = "required";

  activeEvent(): void {

  };

  deactiveEvent(): void {

  };

  constructor(public media: TdMediaService) { }

  ngOnInit() {
  }

}
