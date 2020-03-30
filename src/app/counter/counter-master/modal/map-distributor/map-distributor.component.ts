import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-map-distributor',
  templateUrl: './map-distributor.component.html',
  styleUrls: ['./map-distributor.component.scss']
})
export class MapDistributorComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<MapDistributorComponent>, public dialog: MatDialog,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  mapDistributor(distributor) {
    this.bottomSheetRef.dismiss(distributor);

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