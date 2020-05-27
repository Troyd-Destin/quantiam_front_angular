import {Component, ElementRef, ViewChild,OnInit, Input, Inject} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormBuilder, FormControl, FormGroup,Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import { SelectUserService } from '../../shared/select-user/select-user.service';
import {Observable} from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map, startWith,tap} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

 
  carFormObject:any;
  carFormObjectOptions;
  selectedResponsible = [];
  userList;
  filteredUsers;  
  isPopUp = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  
  @ViewChild('responsibleInput') responsibleInput: ElementRef<HTMLInputElement>;

  @Input() carObject = { id: null, name:null, description: null, type: null,index: null, arrayLength:null, saved: false,
     project_id: null, occurred: null, responsible:null, disposition_comment:null, effective:null, status: null, completed: null, target_completion: null, completed_at: null};

  constructor(
    
    private http: HttpClient,
    private userService:SelectUserService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,    
    private notification: NotificationsService,
    ) { }

  ngOnInit(): void {
  

    if(this.data){ 
      
      this.carObject = this.data;
      this.isPopUp = true;
      
      if(this.data.responsible)
      {
        this.selectedResponsible = [];
        this.carObject.responsible.forEach(element => {
              this.selectedResponsible.push(element.employee);
          });
      }
      console.log(this.carObject);
  
     };


    this.carFormObjectOptions = new FormGroup({
      name: new FormControl(this.carObject.name, [Validators.required]),
      description: new FormControl(this.carObject.description, [Validators.required]),
      completed: new FormControl(this.carObject.completed,[Validators.required]),  //ongoing, resolved
      effective: new FormControl(String(this.carObject.effective),null),  //ongoing, resolved
     // type: new FormControl(this.carObject.type,null),  //temporary, permanent
      target_completion: new FormControl(this.carObject.target_completion,[Validators.required]),
      responsible: new FormControl(this.carObject,[Validators.required]),  //who is responsible for this action 
      disposition_comment: new FormControl(this.carObject.disposition_comment,),  //who is responsible for this action 
     });

     this.userService.list();
     this.userService.list$.subscribe((r) => {
          this.userList = r;
          this.filteredUsers = this.carFormObjectOptions.controls['responsible'].valueChanges
        .pipe(
          startWith(''),
          map(value => {
           // console.log(value);
              if(value)
              {
              const filteredArray = this.userList.filter((item)=>{
               //  console.log(item.name.includes(value));
                if((item.name.toLowerCase().includes(value) || item.name.includes(value)) && item.active) { return item; }
              })               
              return filteredArray;
             }
            return this.userList;
          })
        );

      });
  
  
  }


  updateCar()
  {
    //  this.http.put()
    let params =  this.carFormObjectOptions.getRawValue();
    if(status){ params.status = status; }
    params.responsible = this.selectedResponsible;
    this.http.put(environment.apiUrl + '/car/' + this.carObject.id, params).subscribe((r:any)=>{
      this.carObject = Object.assign({}, r, this.carObject);
      this.data.saved = true;
      this.data = r;
      this.notification.success('Success',  'Car Details Saved', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton
      // this.canEditCheck();
    }) 

  }


  deleteCar()
  {
    if(confirm('Do you really want to delete this CAR'))
    {
    this.http.delete(environment.apiUrl + '/car/' + this.carObject.id).subscribe((r:any)=>{
            this.notification.success('Success',  'Car Deleted', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton
            this.data.deleted = true;
            this.dialogRef.close(this.data);
      // this.canEditCheck();
    }) 
   }
  }

  fetchCar()
  {
    

  }

  selectResponsible(event)
  {
   
    this.selectedResponsible.push(event.option.value);    
    this.responsibleInput.nativeElement.value = '';
    console.log(this.selectedResponsible);
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    this.carFormObjectOptions.controls['responsible'].setValue(null);    
    this.responsibleInput.nativeElement.value = '';
  }

  remove(event,index): void {
    console.log(event,index);
    if (index >= 0) {
      this.selectedResponsible.splice(index, 1);
    }
  }

  nextCar()
  {
    this.data.next = true;
    this.dialogRef.close(this.data);
    console.log(this.data);
  }

  previousCar()
  {
    this.data.previous = true;
    this.dialogRef.close(this.data);
  }





}
