import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EkycService } from '../service/ekyc.service';
import { MatDialog, MatOption } from '@angular/material';
import * as dateformat from 'dateformat';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ekyc-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  baseUrl: string = environment.uri;

  today = dateformat(new Date(+new Date() + (330 * 60 * 1000)), 'dd-mmm-yyyy');

  @ViewChild('AllSalesOffice') private AllSalesOffice: MatOption;
  @ViewChild('AllDivision') private AllDivision: MatOption;
  @ViewChild('AllForms') private AllForms: MatOption;

  filterForm: FormGroup;
  showLoader: boolean = false;
  multiple: boolean = true;
  downloadReady: boolean = false;
  downloadLink: string = '';

  //Filter List Values.
  division: string[];
  sales_office: string[];
  dcList: string[];
  ekycValues: Status[] = [{ value: true, viewValue: 'Only eKYC' }, { value: false, viewValue: 'Complete' }];
  form: Status[] = [
    { value: 'basic_details', viewValue: 'General' },
    { value: 'other_details', viewValue: 'Other Basic Details' },
    { value: 'quality_indicators', viewValue: 'Quality Indicators' },
    { value: 'fans_counter_potential_mapping', viewValue: 'Fans Counter Potential Mapping' },
    { value: 'fans', viewValue: 'Fans' },
    { value: 'water_heater', viewValue: 'Water Heater' },
    { value: 'irons', viewValue: 'Irons' },
    { value: 'air_coolers', viewValue: 'Air Coolers' },
    { value: 'room_heater', viewValue: 'Room Heater' },
    { value: 'utility_lighting', viewValue: 'Utility Lighting' },
    { value: 'mixer_grinder', viewValue: 'Mixer Grinder' },
    { value: 'induction_cooktop', viewValue: 'Induction Cooktop' },
    { value: 'gas_cooktop', viewValue: 'Gas Cooktop' },
    { value: 'otg', viewValue: 'OTG' },
    { value: 'btl_planning', viewValue: 'BTL PLanning' },
    { value: 'sewing_machine', viewValue: 'Sewing Machine' },
  ];


  constructor(private fb: FormBuilder, private _ekyc: EkycService, public dialog: MatDialog) { }

  exportReport() {

    //Check If More Than Single Sales Offices are selected.
    if (this.filterForm.value.sales_office.length > 1) {
      let rgx = /@v5global.com/; let regex = /@usha.com/
      let email = prompt('File you are requesting seems to be large, Please Provide Your Email id');
      if (!rgx.test(email) && !regex.test(email)) return alert('Email should contain domain @usha.com');

      //Register File Download request.
      this._ekyc.getDownloadReport({ multiple: this.multiple, ...this.filterForm.value, email }).subscribe(
        (link) => {
          //Open Success Component.
          this.dialog.open(SuccessComponent, {
            width: '450px',
            data: { title: 'Success!', content: `Your request has been registered successfully! Soon You will recieve download link via email.` }
          });
        },
        err => console.log(err)
      );
      return;

    }

    this.showLoader = true;
    this._ekyc.getDownloadReport({ multiple: this.multiple, ...this.filterForm.value }).subscribe(
      (link) => {
        this.downloadReady = true;
        this.downloadLink = link
      },
      err => console.log(err)
    );
  }

  //Download Report.
  downloadReport() {
    window.open(this.downloadLink, '_blank');
    this.downloadReady = false;
    this.showLoader = false;

  }

  // Toggle MultiSelect Options.
  toggleAllSelection(formControlName, reference) {
    if (this[reference].selected) {
      switch (formControlName) {
        case 'sales_office':
          this.filterForm.controls[formControlName].patchValue(this[formControlName]);
          break;
        case 'division':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.dvcode));
          break;
        case 'form':
          this.filterForm.controls[formControlName].patchValue(this[formControlName].map(i => i.value));
          break;
      }
      this[reference].select();
    }
    else {
      this.filterForm.controls[formControlName].patchValue([]);
      this[reference].deselect();
    }
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      division: [[]],
      sales_office: [[], Validators.required],
      dc: [[]],
      form: [['basic_details'], Validators.required],
      only_ekyc: [true]
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.dcList = JSON.parse(localStorage.dcList);
  }

}

export interface Status {
  value: boolean | string;
  viewValue: string;
}
