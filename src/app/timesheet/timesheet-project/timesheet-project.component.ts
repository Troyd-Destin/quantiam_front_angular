import { Component, OnInit } from '@angular/core';

import {  environment} from '../../../environments/environment';

import {  HttpClient} from '@angular/common/http';

import { HotTableRegisterer } from '@handsontable/angular';

@Component({
  selector: 'app-timesheet-project',
  templateUrl: './timesheet-project.component.html',
  styleUrls: ['./timesheet-project.component.css']
})
export class TimesheetProjectComponent implements OnInit {

  private hotRegisterer = new HotTableRegisterer();
  id = 'hotInstance';
  projectSourceList = [];
  categoryHandsList = [
    'Wear and Bllistics Products',
    'Research & Technology - HPMEEs Projects',
    'Sales, Marketing & Business Development',
    'Consulting & Technical Services',
    'Prototype Pilot Manufacturing',
    'Corporate',
    'Absence',
  ];
  hotTableSettings = {
    
    
    colHeaders: true,
  //  height: '400px',
  afterChange: (hotInstance, changes, source) =>{

      console.log(changes);
    }
    //height="((30+(22*PC.projectList.data.length)))"
  }
  renderTable = false;

  constructor(private http: HttpClient,) { }

  ngOnInit() {

    
    this.fetchProjectList();
  }


  fetchProjectList = function ()
	{
		  
      this.http.get(environment.apiUrl + '/project').subscribe(response => {

          console.log(response);
          this.hotRegisterer.getInstance(this.id).loadData(response);
          console.log(this.hotTableSettings);
      })
	}

}
