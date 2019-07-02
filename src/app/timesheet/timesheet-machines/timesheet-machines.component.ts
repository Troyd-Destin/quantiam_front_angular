import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HotTableRegisterer } from '@handsontable/angular';
import { UserService } from '../../services/user/user.service';
import { NotificationsService } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-timesheet-machines',
  templateUrl: './timesheet-machines.component.html',
  styleUrls: ['./timesheet-machines.component.css']
})
export class TimesheetMachinesComponent implements OnInit {

  constructor(public userService: UserService, private notify: NotificationsService, private http: HttpClient) { }

  purposes = ['Experimental','Heat Treatment at Atmospheric Pressure','Low Temperature Debind Furnace','Mechano-Synthesis','Physical Properties Testing','Powder Analysis','Surface Analysis','TGA','Vacuum Heat Treatment Furnace'];
  billingCategories = ['Specialized Technical Services','Specialized Heat Treatment Services','Specialized Analytical Services'];
  denominations = ['Cycles','Days','Experiments','Half_days','Hours','Runs','Samples'];

  private hotRegisterer = new HotTableRegisterer();
  hotTableSettings: any = {
    colHeaders: true,
    afterChange: (changes, source) => {
      console.log(changes, source);
      if(changes)
      {
        const rowProp: any = this.hotRegisterer.getInstance('id').getSourceDataAtRow(changes[0][0]);
        console.log(changes);
        const payload:any = {};
        payload[changes[0][1]] = changes[0][3];
        payload.id = rowProp.id;
        console.log(rowProp);
        if(changes[0][2] !== changes [0][3]){ // only trigger if different 
        this.updateMachine(payload.id, payload);
        }
      }
    }

  }

  ngOnInit() {
    this.fetchMachines();

  }


  fetchMachines(){

    this.http.get(environment.apiUrl + `/machine`).subscribe((r:any)=>{

       this.hotRegisterer.getInstance('id').loadData(r.data);
    })
  }

  updateMachine(id,payload ){

    this.http.put(environment.apiUrl + `/machine/${id}`,payload).subscribe((r)=>{

    });
  }

  addTableRow(){


    if(confirm('Are you sure you want to create a new machine?'))
    {

      this.http.post(environment.apiUrl + `/machine`,null).subscribe((r:any)=>{
        this.hotRegisterer.getInstance('id').alter('insert_row',0);
        this.hotRegisterer.getInstance('id').setDataAtCell(0,0, r.id );
      })
    }
  }

  createMachine(){


  }


}
