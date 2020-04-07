
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild,OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup,Validators} from '@angular/forms';
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
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-ncr',
  templateUrl: './ncr.component.html',
  styleUrls: ['./ncr.component.css']
})
export class NcrComponent implements OnInit {

  
  @ViewChild('responsibleInput') responsibleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ncrFiles: NgxFileDropEntry[] = [];
  ncrName;
  ncrOptions;
  ncrObject = {
    id:null, status: null, name: null, requirement_violated:null,
    type:null,severity:null,description:null,buisness_unit:null,project_id:null,occurred:null
  };
  ncrLoading = false;

  showNcrDocumentUpload = false;
  showCarDocumentUpload = false; 

  projectList;
  filteredProjects: Observable<any[]>;

  userList;
  filteredUsers: Observable<any[]>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedResponsible = [{id:65,name:'Tyson Boyce',title:'QA/QC Supervisor', clearable: false}
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

    this.ncrOptions = new FormGroup({
      name: new FormControl(this.ncrObject.name, [Validators.required]),
      requirement_violated: new FormControl(this.ncrObject.requirement_violated, [Validators.required]),
      type: new FormControl(this.ncrObject.type, [Validators.required]),
      severity: new FormControl(this.ncrObject.severity, [Validators.required]),
      description: new FormControl(this.ncrObject.description, [Validators.required]),
      immediate_containment_action: new FormControl(null,null),
      buisness_unit: new FormControl(this.ncrObject.buisness_unit, [Validators.required]),
      status: new FormControl(this.ncrObject.status,null),
      project_id: new FormControl(this.ncrObject.project_id,null),
      occurred: new FormControl(this.ncrObject.occurred,[Validators.required]),
      responsible: new FormControl(this.selectedResponsible,[Validators.required]),
     });

     this.ncrOptions.controls['responsible'].setValue({id:65,name:'Tyson Boyce',title:'QA/QC Supervisor', clearable: false});


  
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
                 if((item.name.toLowerCase().includes(value) || item.name.includes(value)) && item.active) { return item; }
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
        this.selectedResponsible = [];
        r.responsible.forEach(element => {
            this.selectedResponsible.push(element.employee);
        });

        this.ncrOptions.updateValueAndValidity();
        this.ncrLoading = false;

    })

  }

  updateNCR(status)
  {     
      
      let params =  this.ncrOptions.getRawValue();
      if(status){ params.status = status; }
      params.responsible = this.selectedResponsible;
      this.http.put(environment.apiUrl + '/ncr/' + this.ncrObject.id, params).subscribe((r)=>{
        this.notification.success('Success',  'NCR Details Saved', {timeOut: 4000, showProgressBar: false, clickToClose: true}); /// Daily OT notificaton
      }) 
  }

  selectResponsible(event)
  {
   
    this.selectedResponsible.push(event.option.value);    
    this.responsibleInput.nativeElement.value = '';
    console.log(this.selectedResponsible);
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    this.ncrOptions.controls['responsible'].setValue(null);    
    this.responsibleInput.nativeElement.value = '';
  }

  remove(event,index): void {
    console.log(event,index);
    if (index >= 0) {
      this.selectedResponsible.splice(index, 1);
    }
  }


  checkEditPrivledges()
  {


  }


  NCRdroppedfile(files: NgxFileDropEntry[]){
    this.ncrFiles = files;
    console.log(files);
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
           **/
          const formData = new FormData()
          formData.append('media', file, droppedFile.relativePath)
  
          this.http.put(environment.apiUrl + '/ncr/' + this.ncrObject.id, formData, { responseType: 'blob' })
          .subscribe(data => {
              console.log(data);
            // Sanitized logo returned from backend
          })
         

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }}
  NCRfileOver(event){ console.log(event);}
  NCRfileLeave(event){ console.log(event);}


}
