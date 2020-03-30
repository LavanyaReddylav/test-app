import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { BeatData } from '../../../model/beat-model';
import { BeatService } from '../../../service/beat.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';


@Component({
  selector: 'beat-master-table',
  templateUrl: './master-table.component.html',
  styleUrls: ['./master-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MasterTableComponent implements OnInit, AfterViewInit {

  @Input() beats: BeatData[];
  @Output() successEvent = new EventEmitter();


  displayedColumns: string[] = ['select', 'name', 'division', 'gtm_city', 'sales_office', 'dc', 'active'];
  dataSource: MatTableDataSource<BeatData>;
  selection = new SelectionModel<BeatData | any>(true, []);
  expandedElement: BeatData;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, private cdref: ChangeDetectorRef, private _beat: BeatService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }

  selectBeats() {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Activate Beats.
  activateBeats(active) {
    var beats = this.selection.selected;
    beats = beats.map(b => b._id);
    const state = { beats, active }
    this._beat.activateBeat(state).subscribe(
      res => {
        this.successEvent.emit();
        this.dialog.open(SuccessComponent, {
          width: '450px',
          data: { title: 'Success!', content: `Selected Beats Updated Successfully.` }
        });
        err => {
          this.dialog.open(FailureComponent, {
            width: '350px',
            data: { title: 'Failure!', content: `${err.error.message}` }
          });
        }
      }
    )


  }//activate Beats.

  openConfirmationModal(): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '450px',
      data: { title: 'Are you sure?', content: `Do you really want to delete these records? This process can't be undone.` }
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(value);
      value == true ? this.dialog.open(SuccessComponent, {
        width: '450px',
        data: { title: 'Success!', content: `Selected Beats Deleted Successfully.` }
      }) : console.log(`confirmation dialog was closed`)
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.beats;
    this.cdref.detectChanges();
  }


}

