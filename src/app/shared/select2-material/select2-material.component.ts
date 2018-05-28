import { Component, OnInit, Input } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { environment } from '../../../environments/environment';

interface Select2SelectionObject {
  
  html: string,
  text: string, 
  label: string,
}

@Component({
  selector: 'app-select2-material',
  templateUrl: './select2-material.component.html',
  styleUrls: ['./select2-material.component.css']
})
export class Select2MaterialComponent implements OnInit {

  public options: Select2Options;
  public value: string;
  
  @Input() width: string;

  ngOnInit() {
    
    this.value = 'test';

      this.options = {
       // multiple: true,
        allowClear: true,
        placeholder: "Material Name",
        tags: true,
       // dropdownCssClass : 'bigdrop',
        //cache: true,
        dropdownAutoWidth : true,
        templateSelection: function(d, c) {	if(!d.label){ return d.text;	} else { return d.label;}	},
        templateResult: function (d) { if(d.html) { return d.html; } else { return d.text;} },
        escapeMarkup: function(m) { return m;	},
        
        width: this.width,
        theme: 'bootstrap',
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
         createTag: function (params){
           
             console.log(params);
             

              return {
                id: params.term,
                text: params.term,
                isNew: true,
              }
             
           
           }

      
    }

 

  }
  
changed(data) {
   
      this.value = data.value;
      console.log(data);
    } 
}
