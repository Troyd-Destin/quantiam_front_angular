
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild,OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup,} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { UserService } from '../../services/user/user.service';
import { ProjectService } from '../../services/project/project.service';
import { SelectUserService } from '../../shared/select-user/select-user.service';
import {Observable} from 'rxjs';
import {map, startWith,tap} from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-ncr',
  templateUrl: './ncr.component.html',
  styleUrls: ['./ncr.component.css']
})
export class NcrComponent implements OnInit {

  
  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ncrOptions = new FormGroup({
    name: new FormControl(),
    requirement_violated: new FormControl(),
    type: new FormControl(),
    severity: new FormControl(),
    description: new FormControl(),
    immediate_containment_action: new FormControl(),
    buisness_unit: new FormControl(),
    status: new FormControl(),
    project_id: new FormControl(),
    responsible: new FormControl(),
   });
  ncrName;
  ncrObject = {id:null, status: null};
  ncrLoading = false;

  showNcrDocumentUpload = false;

  projectList;
  filteredProjects: Observable<any[]>;

  userList;
  filteredUsers: Observable<any[]>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedResponsible = [
  ];

  allUsers;  
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  constructor(
    private userService:SelectUserService,
    private route: ActivatedRoute, 
    private http: HttpClient,
    private notification: NotificationsService,
    private projectService: ProjectService,
    ) {
      

   }

  ngOnInit(): void {
  
    this.ncrLoading = true;

        this.route.params.subscribe((route) =>{
            this.fetchNCR(route.id);
    })
  
     this.projectService.list();
     this.projectService.list$.subscribe((r) => {
          this.projectList = r;
          this.filteredProjects = this.ncrOptions.controls['project_id'].valueChanges
        .pipe(
          startWith(''),
          map(value => {
              if(value)
              {
              const filteredArray = this.projectList.filter((item)=>{
              
                if(item.id.toString().toLowerCase().includes(value) && item.active) { return item; }
              });
              return filteredArray;
            }
            return this.projectList;
          })
        );

      });

      this.userService.list();
      this.userService.list$.subscribe((r) => {
           this.userList = r;
           this.filteredUsers = this.ncrOptions.controls['responsible'].valueChanges
         .pipe(
           startWith(''),
           map(value => {
            // console.log(value);
               if(value)
               {
               const filteredArray = this.userList.filter((item)=>{
                //  console.log(item.name.includes(value));
                 if(item.name.toLowerCase().includes(value) || item.name.includes(value)) { return item; }
               })               
               return filteredArray;
              }
             return this.userList;
           })
         );
 
       });

      
  }


  fetchNCR(id){

    this.http.get(environment.apiUrl + '/ncr/' + id).subscribe((r:any)=>{

        this.ncrObject = r;
        this.ncrOptions.patchValue(r);
        this.ncrLoading = false;

    })

  }

  updateNCR()
  { 
      this.http.put(environment.apiUrl + '/ncr/' + this.ncrObject.id, this.ncrOptions.getRawValue()).subscribe((r)=>{
        this.notification.success('Success',  'NCR Details Saved', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton
      }) 
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    console.log(event);

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedResponsible.push(value);
    }

    console.log(this.selectedResponsible);

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.selectedResponsible.indexOf(fruit);

    if (index >= 0) {
      this.selectedResponsible.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): any {
    this.selectedResponsible.push({name:'test'});
    this.userInput.nativeElement.value = '';
  }



}
