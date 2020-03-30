import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-map-beat',
  templateUrl: './map-beat.component.html',
  styleUrls: ['./map-beat.component.scss']
})

export class MapBeatComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<MapBeatComponent>, public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  mapBeat(beat) {
    this.bottomSheetRef.dismiss(beat);

  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit() {
  }

}

export interface DialogData {
  title: string;
  content: string;
}