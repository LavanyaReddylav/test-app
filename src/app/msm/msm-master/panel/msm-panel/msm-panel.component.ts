import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MSM } from 'src/app/msm/model/msm.model';


@Component({
  selector: 'msm-panel',
  templateUrl: './msm-panel.component.html',
  styleUrls: ['./msm-panel.component.scss']
})
export class MsmPanelComponent implements OnInit {

  @Input() msms: MSM[];
  @Output() successEvent = new EventEmitter();

  step = 0;
  constructor(private cdref: ChangeDetectorRef) { }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit() {
    this.cdref.detectChanges();
  }

}
