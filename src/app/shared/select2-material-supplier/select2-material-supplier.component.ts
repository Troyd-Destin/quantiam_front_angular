import { Component, OnInit, Input,EventEmitter, Output } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-select2-material-supplier',
  templateUrl: './select2-material-supplier.component.html',
  styleUrls: ['./select2-material-supplier.component.css']
})
export class Select2MaterialSupplierComponent implements OnInit {

   public options: Select2Options;
  public value: number;
  public d;
  public uniqueID = 'material-lot-list-'+Math.random(); 
  
  //@Input() width: string = "250px";
  @Input() material_id: number = 0;
  @Input() query_params: string ="{}";
  @Input() enable_create: boolean = false;
  @Input() disabled: boolean = false;
  @Input() multiple: string = '';
  @Input() default_lot: any = {};
  @Input() s2options = null;
  @Input() placeholder = null;

  @Output() selectedValue = new EventEmitter<any>();
  
  ngOnInit() {
       
    this.default_lot.id ? this.value = this.default_lot.id : null;
    
    let parsed_params = JSON.parse(this.query_params);
   //console.log(this.material_id,this.width,testv);
	
      this.options = {
        //multiple: true,
        //allowClear: true,
        placeholder: this.placeholder || "Supplier",
       
       // dropdownCssClass : 'bigdrop',
        //cache: true,
		
        dropdownAutoWidth : true,
        templateSelection: function(d:any, c) {	
        
		//if(!d.label){ return d.text;	} else { return d.label;}
            
            return ''+(d.text || d.supplier_name)+'';
         },
        templateResult: function (d:any) { 
          
          //console.log(d);
          
          
          
          return (d.text || d.supplier_name);
          
       // if(d.html) { return d.html; } else { return d.text;}
        
        },
        escapeMarkup: function(m) { return m;	},
       
      //  width: '400px',
        theme: 'classic',
           ajax: {
              url: environment.apiUrl+'/material/supplier',
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
	
	if(this.enable_create) {
	
	//console.log(this.multiSelect);
	
	this.options.tags = true;
	this.options.createTag = function (params){
           
             console.log('This is the create event',params);
             

              return {
                id: params.term,
                text: params.term,
                value: params.term,
                isNew: true,
              }
             
           
           };
	}
  
	
	Object.assign(this.options, JSON.parse(this.s2options));
/*   $('#mySelect2').on('select2:select', function (e) {
  // Do something
}); */
 
}
  
changed(data) {
   
      this.selectedValue.emit(data);
     // this.value = data.value;
      console.log(data);
    }
    
    
    
}
