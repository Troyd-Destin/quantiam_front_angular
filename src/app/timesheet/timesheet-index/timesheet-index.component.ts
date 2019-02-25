import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-timesheet-index',
  templateUrl: './timesheet-index.component.html',
  styleUrls: ['./timesheet-index.component.css']
})
export class TimesheetIndexComponent implements OnInit {

  routeParams: any;

  constructor(private router: Router, private route: ActivatedRoute, ) { }

  ngOnInit() {


    // figure out current payperoid year


     this.route.paramMap.subscribe(params => {
      this.routeParams.userId = params.get('user');
      this.routeParams.year = params.get('year');
      this.routeParams.payperoid = params.get('payperoid');


    });
  }



  calculatePayperiod() {
      // $month =  Date("n", strtotime($startdate) );
      // $year =  Date("Y", strtotime($startdate));


      // $ReferenceDate = strtotime("2012-01-01"); // Define Reference Date
      // $startdate = strtotime($startdate); // Define Reference Date

      // $test1 = ($startdate-$ReferenceDate); // # seconds since reference date
      // $test2 = Floor($test1/1209600+1);  //payperiods since reference date
      // $test3 = floor(floor($test2/26));  // # of years since reference year
      // $test4 = $test2-($test3*26); // # of payperiods into the year of interest // Also returns current payperoid


      // $payPeriod = intval($test4 + 1);

    	// dd($payPeriod,$month);
      // if(($payPeriod == 1 || $payPeriod == 2) && $month == 12)
      // {
      //   $year = $year +1;
      // }



      // $returnArray['year'] = $year;
      // $returnArray['payperiod'] = $payPeriod;
      //   	dd($returnArray);
      // return $returnArray;

  }

}
