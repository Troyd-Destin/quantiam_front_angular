import { Component, OnInit, Input,EventEmitter, Output } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-select2-user',
  templateUrl: './select2-user.component.html',
  styleUrls: ['./select2-user.component.css']
})
export class Select2UserComponent implements OnInit {

  
  public options: Select2Options;
  public value: number;
  public d;

  uniqueID;
  multiple = false;
  
  
   @Input() disabled: boolean = false; 
   @Input() query_params: string ="{}"; 
   @Input() s2options = null;   
   @Input() placeholder = null;

   @Output() selectedValue = new EventEmitter<any>();

   
   
   ngOnInit() {
   
   
    //this.default_lot.id ? this.value = this.default_lot.id : null;
    
    let parsed_params = JSON.parse(this.query_params);
   //console.log(this.material_id,this.width,testv);
	
      this.options = {
        //multiple: true,
        //allowClear: true,
        placeholder: this.placeholder || "Employee",
       
       // dropdownCssClass : 'bigdrop',
        //cache: true,
		
        dropdownAutoWidth : true,
        templateSelection: function(d:any, c) {	if(!d.label){ return d.name;	} else { return d.label;}	},
        templateResult: function (d:any) { if(d.html) { return d.html; } else { return d.text;} },
        escapeMarkup: function(m) { return m;	},
        
        theme: 'classic',
           ajax: {
              url: environment.apiUrl+'/user/list',
              type: "GET",
              headers:
              {
                'Authorization': 'Bearer '+localStorage.getItem('token'),
              },              
              
              
              processResults: function (data) {
              
                  
              
                 let returnObj:any = {};
                 returnObj.pagination = {};
                 returnObj.results = data;
                  
                  if(data.more) returnObj.pagination.more = true;  
                
                  return returnObj;
               
              }
           },
       

      
    }

  
	
	Object.assign(this.options, JSON.parse(this.s2options)); //merge custom options into the above. 

 
}
  
changed(data) {
   
      this.selectedValue.emit(data);
     // this.value = data.value;
      console.log(data);
    }
    
    
    
}


