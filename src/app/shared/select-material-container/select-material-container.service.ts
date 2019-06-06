import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { catchError, map, tap,  } from 'rxjs/operators';
import { Observable,  BehaviorSubject,  } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class SelectMaterialContainerService {

  constructor() { }
}
