import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MappingToolService } from '../service/mapping-tool.service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { startWith, map, take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { SuccessComponent } from 'src/app/shared/modal/success/success.component';

@Component({
  selector: 'master-mapping',
  templateUrl: './master-mapping.component.html',
  styleUrls: ['./master-mapping.component.scss']
})
export class MasterMappingComponent implements OnInit, AfterViewInit, OnDestroy {

  filterForm: FormGroup;
  loader: boolean = false;
  errors: string[] = [];
  updates: string[] = [];

  //selected options for the filter
  division: any[];
  sales_office: string[];
  gtm_city: string[];
  dcList: string[];
  distributorList: any[] = [];
  userList: any[];
  beatList: any[] = [];
  counterList: any[] = [];
  dateList: any[] = [];
  monthList: any[] = [
    { value: 0, viewValue: 'January' },
    { value: 1, viewValue: 'February' },
    { value: 2, viewValue: 'March' },
    { value: 3, viewValue: 'April' },
    { value: 4, viewValue: 'May' },
    { value: 5, viewValue: 'June' },
    { value: 6, viewValue: 'July' },
    { value: 7, viewValue: 'August' },
    { value: 8, viewValue: 'September' },
    { value: 9, viewValue: 'October' },
    { value: 10, viewValue: 'November' },
    { value: 11, viewValue: 'December' },
  ];
  selectedDates: any[] = [];
  unSelectedCounters: any[] = [];

  distributor = new FormControl('', Validators.required);
  distributorFilterCtrl: FormControl = new FormControl();

  user = new FormControl('', Validators.required);
  userFilterCtrl: FormControl = new FormControl();

  beat = new FormControl('', Validators.required);
  beatFilterCtrl: FormControl = new FormControl();

  counter = new FormControl([], Validators.required);
  counterFilterCtrl: FormControl = new FormControl();

  dates = new FormControl([], Validators.required);
  month = new FormControl(new Date().getMonth(), Validators.required);

  public filteredDistributors: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredBeats: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCounters: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('distributorSelect') distributorSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(public dialog: MatDialog, private fb: FormBuilder, private _mapping: MappingToolService) { }

  //Get Distributors on selection.
  getDistributor(value) {
    this.loader = true;
    this.distributorList = [];
    this.distributor.reset();
    this._mapping.getDistributors(value, { sap_code: 1, name: 1 }).subscribe(
      (res: any) => { this.loader = false; this.distributorList = res; this.filterDistributors(); },
      (err: any) => { this.loader = false; this.errors.push(err.error.message); }
    );
  }

  //Get Users on selection.
  getUser(value) {
    this.loader = true;
    this.userList = [];
    this.user.reset();
    this._mapping.getUsers(value, { name: 1, loginid: 1 }).subscribe(
      (res: any) => { this.loader = false; this.userList = res; this.filterUsers(); },
      (err: any) => { this.loader = false; this.errors.push(err.error.message); }
    );
  }

  //Get Beats On Selection.
  getBeat(value) {
    this.loader = true;
    this.beatList = [];
    this.beat.reset();
    this._mapping.getBeats(value, { name: 1, counter: 1 }).subscribe(
      (res: any) => { this.loader = false; this.beatList = res; this.filterBeats(); },
      (err: any) => { this.loader = false; this.errors.push(err.error.message); }
    );
  }

  //Get Counters On Selection.
  getCounter(value) {
    this.loader = true;
    this.counterList = [];
    this.counter.reset();
    this._mapping.getCounters({ ...value, distributor: [this.distributor.value] }, { 'basic_details.sap_code': 1, 'basic_details.name': 1 }).subscribe(
      (res: any) => { this.loader = false; this.counterList = res; this.filterCounters(); },
      (err: any) => { this.loader = false; this.errors.push(err.error.message); }
    );
  }

  //Get Beat Schedules' Dates For a User & Beat.
  getUsersBeatDates(user, beat, month) {
    this.loader = true;
    this.updates.forEach((i, idx) => {
      if (new RegExp('Dates').test(i)) { this.updates.splice(idx, 1) }
    });
    this._mapping.getUsersBeatDates(user, beat, month).subscribe(
      (res: any) => {
        this.loader = false;
        this.selectedDates = res.map(i => new Date(i).toISOString().split('T')[0]);
        this.dates.patchValue(this.selectedDates);
        if (res.length === 0) this.updates.push('Currently No Dates are assigned to selected User & Beat.');
      },
      (err: any) => { this.loader = false; this.errors.push(err.error.message); }
    );
  }

  //Apply Mapping Final Function.
  applyMapping() {

    //Beat Counter Mapping.
    if (this.beat.value && this.beat.dirty && this.counter.dirty && (this.counter.value.length > 0 || this.unSelectedCounters.length > 0)) {

      if (confirm('You are about to map Beat & Selected Counters, Are you sure?'))
        this._mapping.beatCounterMapping({ beat: this.beat.value, selectedCounters: this.counter.value, unSelectedCounters: this.unSelectedCounters }).subscribe(
          res => {
            //Open Success Component.
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `${res.message}` }
            });
            this.user.reset();
            this.getBeat(this.filterForm.value);
            this.getCounter(this.filterForm.value);
          },
          err => console.log(err)
        );

    }

    //User Beat Schedule Mapping.
    if (this.user.value && this.user.dirty && this.beat.value && this.beat.dirty && this.dates.dirty) {

      if (confirm('You are about to map Beat & User with selected Dates, Are you sure?'))
        this._mapping.beatUserMapping({ user: this.user.value, beat: this.beat.value, dates: this.dates.value, month: this.month.value }).subscribe(
          res => {
            //Open Success Component.
            this.dialog.open(SuccessComponent, {
              width: '450px',
              data: { title: 'Success!', content: `${res.message}` }
            });
            this.dates.reset();
          },
          err => console.log(err)
        );

    }

    if (!this.counter.dirty && !this.dates.dirty) {
      alert('You have not made any changes, Hence No Changes made in Mapping!');
    }

    this.updates = [];

  }

  //On Counter Selection Change Event.
  counterSelectionChange(event) {
    if (event.isUserInput) {
      if (event.source.selected === false) {
        if (this.counter.value.length === 0) { this.updates.push('Currently No Counters are mapped to Selected beat.'); }
        this.unSelectedCounters.push(event.source.value);
      } else if (event.source.selected === true) {
        this.updates.forEach((i, idx) => {
          if (new RegExp('Counter').test(i)) { this.updates.splice(idx, 1) }
        });
      }
    }
  }

  //On Filter Form Value Change.
  onChanges(): void {

    //Load Filter Form Data.
    this.filterForm.valueChanges.subscribe(value => {

      if (this.filterForm.valid) {

        this.errors = [];

        //Get Distributors.
        this.getDistributor(value);

        //Get Users.
        this.getUser(value);

        //Get Beats.
        this.getBeat(value);

        //Get Counters.
        if (this.distributor.dirty) this.getCounter(value);

      } else return;
    });

    //On Distributor Seletion Change.
    this.distributor.valueChanges.subscribe(val => {
      this.errors.forEach((i, idx) => {
        if (new RegExp('Counter').test(i)) { this.errors.splice(idx, 1) }
      });
      //Get Counters.
      if (this.distributor.dirty) {
        this.getCounter(this.filterForm.value);
      }
      else return;
    });

    //Select Counters On Basis of Beat Selected.
    this.beat.valueChanges.subscribe(val => {
      if (this.beat.dirty && this.counterList.length > 0) {
        if (val.counter.length > 0) {
          this.counter.patchValue([]);
          this.updates.forEach((i, idx) => {
            if (new RegExp('Counter').test(i)) { this.updates.splice(idx, 1) }
          });
          let mapped = this.counterList.filter(i => val.counter.indexOf(i.basic_details.sap_code) != -1);
          mapped = mapped.map(i => i.basic_details.sap_code);
          if (mapped.length === 0) this.updates.push('Currently No Counters are mapped to Selected beat.');
          else this.counter.patchValue(mapped);
        } else this.counter.patchValue([]);
      }
      if (this.user.dirty && this.beat.dirty) {
        this.getUsersBeatDates(this.user.value, this.beat.value.name, this.month.value);
      } else return;
    });

    //On User Selection Change.
    this.user.valueChanges.subscribe(val => {
      if (this.user.dirty && this.beatList.length > 0)
        this._mapping.getBeatsForUser(val).subscribe(
          res => {
            this.beatList.forEach(beat => {
              beat.mapped = res.indexOf(beat.name) != -1 ? true : false;
            });
          },
          err => console.log(err)
        );
    });

    //Distributor Filter Control.
    this.distributorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDistributors();
      });

    //User Filter Control.
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUsers();
      });

    //Beat Filter Control.
    this.beatFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBeats();
      });

    // Counter Filter Control.
    this.counterFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCounters();
      });

    //Month Value Changes.
    this.month.valueChanges.subscribe(val => {
      this.dates.reset();
      this.dateList = [];
      this.dateList = this.getAllDatesOfMonth(val, new Date().getFullYear());
      this.getUsersBeatDates(this.user.value, this.beat.value.name, this.month.value);
    });

    //On Dates Changes.
    this.dates.valueChanges.subscribe(val => {
      if (val.length > 0) {
        this.updates.forEach((i, idx) => {
          if (new RegExp('Dates').test(i)) { this.updates.splice(idx, 1) }
        });
      } else {
        this.updates.push('Currently No Dates are assigned to selected User & Beat.');
      }
    });

    //On Sales Office Change.
    this.filterForm.get('sales_office').valueChanges.subscribe(val => {
      if (val[0] === 'UMAY') {
        this.division = [{ division: 'all', code: 'All Divisions', dvcode: 'all' }];
      } else this.division = JSON.parse(localStorage.divisionList);
    });

  } //OnChanges ends.


  ngOnInit() {
    this.filterForm = this.fb.group({
      sales_office: [[], Validators.required],
      gtm_city: [[], Validators.required],
      division: [[], Validators.required],
      dc: [[], Validators.required],
    });
    this.division = JSON.parse(localStorage.divisionList);
    this.sales_office = JSON.parse(localStorage.salesOfficeList);
    this.gtm_city = JSON.parse(localStorage.gtmCityList);
    this.dcList = JSON.parse(localStorage.dcList);

    this.counter.setValue([]);
    this.dates.setValue([]);

    this.filteredDistributors.next(this.distributorList.slice());
    this.filteredCounters.next(this.counterList.slice());

    this.onChanges();

    //Populate Date List with current Months dates.
    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    this.dateList = this.getAllDatesOfMonth(month, year);

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // Toggle All Selection.
  toggleAllSelection(selected, formControlName) {
    if (selected) {
      switch (formControlName) {
        case 'dates':
          this[formControlName].patchValue(this.dateList);
          break
      }

    }
    else {
      this.dates.setValue([]);
    }
  }


  //Toggle All Selection with filter.
  toggleSelectAll(selectAllValue: boolean) {
    this.filteredCounters.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.counter.patchValue(val.map(c => c.basic_details.sap_code));
        } else {
          this.counter.patchValue([]);
        }
      });
  }

  protected setInitialValue() {
    this.filteredDistributors
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // this.distributorSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });

    this.filteredUsers
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });

    this.filteredBeats
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });


  }

  //Filter Distributors.
  protected filterDistributors() {
    if (!this.distributorList) {
      return;
    }
    // get the search keyword
    let search = this.distributorFilterCtrl.value;
    if (!search) {
      this.filteredDistributors.next(this.distributorList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Distributors.
    this.filteredDistributors.next(
      this.distributorList.filter(d => d.name.toLowerCase().indexOf(search) > -1)
    );
  }

  //Filter Users.
  protected filterUsers() {
    if (!this.userList) {
      return;
    }
    // get the search keyword
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.userList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Distributors.
    this.filteredUsers.next(
      this.userList.filter(d => d.name.toLowerCase().indexOf(search) > -1)
    );
  }

  //Filter Beats.
  protected filterBeats() {
    if (!this.beatList) {
      return;
    }
    // get the search keyword
    let search = this.beatFilterCtrl.value;
    if (!search) {
      this.filteredBeats.next(this.beatList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Distributors.
    this.filteredBeats.next(
      this.beatList.filter(d => d.name.toLowerCase().indexOf(search) > -1)
    );
  }

  //Filter Counters.
  protected filterCounters() {
    if (!this.counterList) {
      return;
    }
    // get the search keyword
    let search = this.counterFilterCtrl.value;
    if (!search) {
      this.filteredCounters.next(this.counterList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Distributors.
    this.filteredCounters.next(
      this.counterList.filter(d => d.basic_details.name.toLowerCase().indexOf(search) > -1)
    );
  }

  //Get ALL Dates Of The Month.
  getAllDatesOfMonth(month: number, year: number): Date[] {

    let sDate = new Date(year, month, 1, 5, 30, 0);
    let eDate = new Date(year, month + 1, 0, 5, 30, 0, 0);

    let Dates = [];

    while (sDate <= eDate) {
      Dates.push(sDate.toISOString().split('T')[0]);
      sDate = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate() + 1, 5, 30, 0, 0);
    }
    return Dates;
  }

  //Reset Form Controls.
  reset() {
    this.filterForm.reset();
    this.counter.reset();
    this.beat.reset();
    this.distributor.reset();
    this.user.reset();
    this.dates.reset();
  }

}
