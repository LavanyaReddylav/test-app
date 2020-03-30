import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AddcounterComponent } from './modal/addcounter/addcounter.component'
import { CounterService } from '../service/counter.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'counter-master',
  templateUrl: './counter-master.component.html',
  styleUrls: ['./counter-master.component.scss']
})

export class CounterMasterComponent implements OnInit {

  baseUrl: string = environment.uri;

  filterForm: FormGroup;
  counters;
  showTable: boolean = false;
  showUpload: boolean = false;
  progressValue: number = 0;
  uploadForm: FormData;
  error: any;
  DownloadFormat: boolean = false;

  //List Values
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  activeList: CounterStatus[] = [{ value: '', viewValue: 'All' }, { value: true, viewValue: 'Active' }, { value: false, viewValue: 'InActive' }];
  classList: string[] = ['A', 'B', 'C', 'D', 'E'];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _counter: CounterService, private excel: ExcelService) { }

  //Download format.
  downloadFormat() {
    this.DownloadFormat = true;
  }

  uploadEvent(file: File) {
    this.uploadForm = new FormData();
    this.uploadForm.append('excel', file);
    this._counter.uploadCounters(this.uploadForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressValue = (event.loaded / event.total) * 100;
            break;
          case HttpEventType.Response:
            this.dialog.open(SuccessComponent, {
              width: '550px',
              data: { title: 'Success!', content: `Counters Uploaded Successfully.` }
            })
        }//switch case.
      },//event ends 
      err => {
        this.error = err;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }); //err , subscriber ends.
  };//uploadEvent ends.

  selectEvent(file: File): void {
    this.progressValue = 0;
  }

  cancelEvent(): void {
    this.progressValue = 0;
  }

  //load counters
  loadCounters() {
    this.showTable = true;
    this.counters = null;
    this._counter.getCounters(this.filterForm.value).subscribe(
      res => {
        this.counters = res;
      },
      err => {
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
        this.showTable = false;
      }
    );
  }  //load counters

  //open dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(AddcounterComponent, {
      width: '650px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog was closed ${result}`);
    });
  } //open dialog

  // All
  // All
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'sales_office':
          this.filterForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'gtm_city':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.name));
          break;
        case 'division':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
      }

    }
    else {
      this.filterForm.controls[formControlName].patchValue([]);
    }
  }

  //Export Beats.
  exportAsExcel() {
    const data = this.counters.map((item: any) => {
      return {
        sap_code: item.sap_code,
        store_code: item.store_code,
        sales_office: item.sales_office,
        gtm_city: item.gtm_city,
        division: item.division.join(', '),
        dc: item.dc.join(', '),
        distributor: item.distributor.join(', '),
        name: item.name,
        counter_class: item.counter_class,
        latitude: item.latitude,
        longitude: item.longitude,
        opening_time: item.opening_time,
        closing_time: item.closing_time,
        weekly_off: item.weekly_off,
        pan_number: item.pan_number,
        gst_number: item.gst_number,
        updated_on: item.updated_on.map((i: any) => new Date(i).toISOString().split('T')[0]).join(', '),
        updated_by: item.updated_by.join(', '),
        image: item.image.join(', '),
        pan_image: item.pan_image,
        gst_image: item.gst_image,
        businesscard_image: item.businesscard_image,
        tally_bpmcode: item.tally_bpmcode,
        store_closure_date: item.store_closure_date,
        address: item.address.address,
        locality: item.address.locality,
        pincode: item.address.pincode,
        owner_name: item.owner.owner_name,
        owner_email: item.owner.owner_email,
        owner_mobile: item.owner.owner_mobile,
        owner_stdcode: item.owner.owner_stdcode,
        owner_landline: item.owner.owner_landline,
        owner_fax: item.owner.owner_fax,
        state: item.location.state,
        city: item.location.city,
        district: item.location.district,
        town_population: item.location.town_population,

      }
    });
    this.excel.exportAsExcelFile(data, 'counters');
  }


  ngOnInit() {
    this.filterForm = this.fb.group({
      division: [[]],
      sales_office: [[]],
      gtm_city: [[]],
      dc: [[]],
      active: [''],
      counter_class: [[]]
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }

}

export interface CounterStatus {
  value: boolean | string;
  viewValue: string;
}

