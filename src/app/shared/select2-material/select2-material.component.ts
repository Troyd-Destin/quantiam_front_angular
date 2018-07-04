import { Component, OnInit, Input,EventEmitter, Output } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-select2-material',
  templateUrl: './select2-material.component.html',
  styleUrls: ['./select2-material.component.css']
})
export class Select2MaterialComponent implements OnInit {

  public options: Select2Options;
  public value: string;
  public d;
  
  
  @Input() width: string;
  @Input() multiSelect: boolean = false;
  @Input() material_id: number;
  
  @Output() selectedValue = new EventEmitter<any>();
  

  ngOnInit() {
    
    this.value = 'test';
	
      this.options = {
       // multiple: true,
        allowClear: true,
        placeholder: "Material",
        theme: 'classic',
       // dropdownCssClass : 'bigdrop',
        //cache: true,
        dropdownAutoWidth : true,
        templateSelection: function(d:any, c) {	if(!d.label){ return d.text;	} else { return d.label;}	},
        templateResult: function (d:any) { if(d.html) { return d.html; } else { return d.text;} },
        escapeMarkup: function(m) { return m;	},
        
     //   width: this.width,
       
        ajax: {
              url: environment.apiUrl+'/material/list',
              type: "GET",
              headers:
              {
                'Authorization': 'Bearer '+localStorage.getItem('token'),
              },              
              
              
              processResults: function (data) {
              
                 let returnObj = data;
                 returnObj.pagination = {};
                  
                  if(data.more) returnObj.pagination.more = true;  
                
                  return returnObj;
               
              }
           },
       

      
    }
	
	if(this.multiSelect) {
	
	console.log(this.multiSelect);
	
	this.options.tags = true;
	this.options.createTag = function (params){
           
             console.log(params);
             

              return {
                id: params.term,
                text: params.term,
                isNew: true,
              }
             
           
           };
	}
 

  }
  
changed(data) {
   
      this.selectedValue.emit(data);
     // this.value = data.value;
      console.log(data);
    }
}
