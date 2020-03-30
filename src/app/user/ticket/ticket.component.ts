import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { DataService } from 'src/app/shared/service/data.service';
import { ExcelService } from 'src/app/shared/service/excel.service';
import { FailureComponent } from 'src/app/shared/modal/failure/failure.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'lasm-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  filterForm: FormGroup;
  showLoader: boolean = false;
  tickets;
  showTable: boolean = false;
  //selected options for the filter
  division: string[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  ticketStatus: string[] = ['Open', 'Work In Progress', 'Closed'];
  ticketType: any[] = [{ value: '', viewValue: 'All' }, { value: 'Functional', viewValue: 'Functional' }, { value: 'Technical', viewValue: 'Technical' }];

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _user: UserService, private _data: DataService, private _excel: ExcelService) { }

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

  //Export Users.
  exportAsExcel() {
    this._excel.exportAsExcelFile(this.tickets, 'Ticket');
  }

  //load Tickets
  loadTickets() {
    this.showTable = true;
    this.showLoader = true
    this.tickets = null;
    this._user.getTicket(this.filterForm.value).subscribe(
      res => {
        this.tickets = res;
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
        this.dialog.open(FailureComponent, {
          width: '350px',
          data: { title: 'Failure!', content: `${err.error.message}` }
        });
      }
    );
  }  //load Tickets


  ngOnInit() {

    this.filterForm = this.fb.group({
      sales_office: [[]],
      gtm_city: [[]],
      division: [[]],
      dc: [[]],
      active: [''],
      type: [''],
      status: [[]],
      starting_date: [''],
      ending_date: ['']
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);
  }
}
