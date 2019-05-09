
import { Component, OnInit } from '@angular/core';
import {  environment} from '../../../environments/environment';
import {  HttpClient} from '@angular/common/http';
import { HotTableRegisterer } from '@handsontable/angular';



@Component({
  selector: 'app-timesheet-rto-allocation',
  templateUrl: './timesheet-rto-allocation.component.html',
  styleUrls: ['./timesheet-rto-allocation.component.css']
})
export class TimesheetRtoAllocationComponent implements OnInit {

  private hotRegisterer = new HotTableRegisterer();
  year = new Date().getFullYear();

  //Hot table
  id = 'hotInstance';
  hotTableSettings:any = {
    colHeaders: true,
    afterChange: (hotInstance, changes, source) =>{

      console.log(changes);
    }
  }

   constructor(private http: HttpClient,) { }


   ngOnInit() {

    
    this.fetchList();
  }


  fetchList()
	{
		  const params: any = {'year': this.year};
      this.http.get(environment.apiUrl + '/rto/allocation/list', {params: params}).subscribe((response:any) => {

         // console.log(response);
          this.hotRegisterer.getInstance(this.id).loadData(response);
          console.log(this.hotTableSettings);
      })
	}


}
