import { SelectionModel } from '@angular/cdk/collections';
import * as _ from 'lodash';
import { Component, OnInit, ViewChild, Input, Output, AfterViewInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatBottomSheet, MatDialog } from '@angular/material';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MapBeatComponent } from '../../modal/map-beat/map-beat.component';
import { MapDistributorComponent } from '../../modal/map-distributor/map-distributor.component';
import { ConfirmationComponent } from 'src/app/shared/modal/confirmation/confirmation.component';

import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { CounterData } from 'src/app/counter/model/counter-model';
import { CounterService } from 'src/app/counter/service/counter.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { BeatService } from 'src/app/beat/service/beat.service';
import { DistributorService } from 'src/app/distributor/service/distributor.service';
import { AddMsmComponent } from '../../modal/add-msm/add-msm.component';

@Component({
  selector: 'counter-master-table',
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

  Query = { sales_office: [], gtm_city: [], division: [], dc: [], name: [], active: true };
  query = { sales_office: [], gtm_city: [], division: [], dc: [], active: true, sap_code: [] };

  @Input() counters: CounterData[];
  @Output() successEvent = new EventEmitter();

  division;
  sales_office;
  beats;
  counter = [];
  distributors;
  displayedColumns: string[] = ['select', 'sap_code', 'name', 'sales_office', 'gtm_city', 'division', 'dc', 'distributor', 'active', 'pan_number', 'gst_number'];
  dataSource: MatTableDataSource<CounterData>;
  expandedElement: CounterData;
  selection = new SelectionModel<CounterData | any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bottomSheet: MatBottomSheet, public dialog: MatDialog, private cdref: ChangeDetectorRef, private _counter: CounterService, private _beat: BeatService, private _distributor: DistributorService) {
    this.dataSource = new MatTableDataSource();
  }


  //Add MSM Model to selected counters.
  addMSM() {
    const dialogRef = this.dialog.open(AddMsmComponent, {
      width: '850px',
      data: { divisions: this.division, counter: this.counter, sales_office: this.sales_office }
    });
  }//Add MSM.

  //Activate/Deactivate Counters.
  activateCounters(active) {
    var counters = this.selection.selected;
    counters = counters.map(c => c._id);
    const state = { counters, active };
    this._counter.activateCounter(state).subscribe(
      res => {
        this.successEvent.emit();
        this.dialog.open(SuccessComponent, {
          width: '450px',
          data: { title: 'Success!', content: `Selected Counters updated Successfully.` }
        });
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      },
    );

  }//activateCounters.

  //Delete Counters.
  deleteCounters(): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '450px',
      data: { title: 'Are you sure?', content: `Do you really want to delete these records? This process can't be undone.` }
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(value);
      value == true ? this.dialog.open(SuccessComponent, {
        width: '450px',
        data: { title: 'Success!', content: `Selected Counters Deleted Successfully.` }
      }) : console.log(`confirmation dialog was closed`)
    });

  }//deleteCounters.

  //Remove Beat Mapping.
  removeBeatMapping(): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '450px',
      data: { title: 'Are you sure?', content: `Do you really want to remove all the beat mappings? This process can't be undone.` }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value == true) {
        var counters = this.selection.selected;
        counters = counters.map(d => d.sap_code);
        this._counter.removeBeatMapping({ counters }).subscribe(
          res => {
            this.successEvent.emit();
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: res.message }
            });
          },//res.
          err => {
            this.dialog.open(FailureComponent, {
              width: '350px',
              data: { title: 'Failure!', content: `${err.error.message}` }
            });
          }//err.
        );//subscribe.
      }//if.
    });

  }//removeBeatMapping.


  //Open Map Beat Component.
  mapBeat(): void {
    const bottomSheetRef = this.bottomSheet.open(MapBeatComponent, {
      data: this.beats
    });
    bottomSheetRef.afterDismissed().subscribe((beat) => {
      if (beat) {
        var counters = this.selection.selected;
        counters = counters.map(c => c.sap_code);
        this._beat.mapBeat({ counters, beat }).subscribe(
          res => {
            this.successEvent.emit();
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `${res.success}` }
            });
          },
          err => {
            this.dialog.open(FailureComponent, {
              width: '350px',
              data: { title: 'Failure!', content: `${err.error.message}` }
            });
          }
        );
      }
    });
  }

  //Open Map Distributor Component.
  mapDistributor(): void {
    const bottomSheetRef = this.bottomSheet.open(MapDistributorComponent, {
      data: this.distributors
    });
    bottomSheetRef.afterDismissed().subscribe((distributor) => {
      if (distributor) {
        var counters = this.selection.selected;
        counters = counters.map(c => c.sap_code);
        this._counter.mapDistributor({ counters, distributor }).subscribe(
          res => {
            this.successEvent.emit();
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `${res.message}` }
            });
          },
          err => {
            this.dialog.open(FailureComponent, {
              width: '350px',
              data: { title: 'Failure!', content: `${err.error.message}` }
            });
          }
        );
      }
    });
  }

  //select counters
  selectCounters() {
    const counters = this.selection.selected;
    this.counter = counters.map(i => i.sap_code);
    let sales_office = counters.map(c => [...c.sales_office]); //Filtering Sales Offices to get Distributors & Beats.
    sales_office = _.uniq(sales_office);
    this.sales_office = sales_office;
    let divisions = counters.map(c => c.division); //Filtering Divisions to get Products for ADD MSM.
    divisions = [].concat.apply([], divisions); //Concatinating the arrays.
    this.division = _.uniq(divisions);
    this.Query.sales_office = sales_office; //Creating Query for getting Beats for Map Beat Component.
    this.query.sales_office = sales_office; //Creating Query for getting Distributors for Map Distributor Component.
    this._beat.getBeats(this.Query).subscribe(
      res => {
        this.beats = res;
      },
      err => console.log(err)
    );
    this._distributor.getDistributors(this.query).subscribe(
      res => {
        this.distributors = res
      },
      err => console.log(err)
    );
  }

  //Check is all counters are selected.
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

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.counters;
    this.cdref.detectChanges();
  }

}


