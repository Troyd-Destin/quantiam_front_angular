import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of , forkJoin } from 'rxjs';
import { debounce } from 'lodash';
import { map, tap } from 'rxjs/operators';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

@Component({
    selector: 'app-threedmodel-database',
    templateUrl: './threedmodel-database.component.html',
    styleUrls: ['./threedmodel-database.component.css']
})
export class ThreedmodelDatabaseComponent implements OnInit {

    constructor(private http: HttpClient) {
        this.searchContentsOfAllProjects = debounce(this.searchContentsOfAllProjects, 500);
    }

    private gridApi;
    private gridColumnApi;
    tokenResponse;
    quantiamhub;
    projectID;
    projectFolderId;
    projectList;
    filteredTextFilterName;
    topLevelresults;
    allSearchResults;
    quantiamDrawingsToggle = false;


    private loading: boolean = false;
    searchResults$: Observable < any > ;
    modules = [ClientSideRowModelModule];

    columnDefs = [

        { field: 'type', headerName:'', width:90 },
        { field: 'attributes.displayName', headerName:'Name', width:300 },

        {
            headerName: 'Ver.',
            width:90,
            field: 'relationships.tip.data.id',
            cellRenderer: function(item) {
                const items = item.value.split('version=');
                return items[1];
            }
        },
        {
            field: 'attributes.lastModifiedTime',
            headerName: "Modified",
        },
        {
            field: 'attributes.createUserName',
            headerName: "User",
        },
        {
            field: '',
            onCellClicked: (cell) => {

                if (cell.data) {
                    //this.router.navigate(['/sem/run/' + cell.data.semrun_id]);
                }
                //  console.log('worked');

            },
            cellRenderer: function(item) {

                //console.log(item);

                if (item.data.attributes.type === 'items') {
                    var bim360Url = 'https://docs.b360' + (item.data.relationships.parent.data.id.indexOf('emea') > 0 ? '.eu' : '') +
                        '.autodesk.com/projects/' + item._source.projectId.replace("b.", '') +
                        '/folders/' + item._source.folderUrn +
                        '/detail/viewer/items/' + item._source.itemUrn;

                    console.log(bim360Url);
                    if (item.value) {
                        return bim360Url;
                    }
                }


                return '';
            },

        },


    ];

    defaultColDef = {

        sortable: true,
        resizable: true,
        filter: false,
        cellStyle: function(params) {
            return {
                cursor: 'pointer',
            };
        },

    };




    ngOnInit(): void {
        this.authenticateFusion();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

    }

    authenticateFusion() {


        // probalby should request this from our api server; store issued token
        this.http.get(environment.apiUrl + '/fusion/token').subscribe(r => {

            this.tokenResponse = r;
           // this.fetchHubList();
           this.fetchProjectList();

        });

    }


    fetchHubList() {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };
        this.http.get('https://developer.api.autodesk.com/project/v1/hubs', httpOptions).subscribe((r: any) => {

            this.quantiamhub = r.data[0];




            this.fetchProjectList();

            console.log(r);

        });


    }

    fetchProjectList() {
      //// Fetch projects only from QHUB. 
      //this.quantiamhub.id = ;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };
        this.http.get('https://developer.api.autodesk.com/project/v1/hubs/a.YnVzaW5lc3M6cXVhbnRpYW0/projects', httpOptions).subscribe((r: any) => {


            ///this.fetchFolderContents(r.data[0].id, r.data[0].relationships.rootFolder.data.id);
            //this.searchFolderContents(r.data[0].id, r.data[0].relationships.rootFolder.data.id, 'calendar');
            this.projectList = r.data;
            this.projectID = r.data[0].id;
            this.projectFolderId = r.data[0].relationships.rootFolder.data.id;
            console.log(r);
            this.toggleQuantiamDrawings();
            //this.getContentsOfAllProjects();
            //this.fetchProject(this.quantiamhub.id, this.projectID);
            //  console.log(r);


        });


    }

    fetchProject(hub_id, project_id) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };
        this.http.get('https://developer.api.autodesk.com/project/v1/hubs/' + hub_id + '/projects/' + project_id, httpOptions).subscribe((r: any) => {

            console.log(r);



            //this.fetchFolderContents(project_id, r.data.relationships.rootFolder.data.id);


        });




    }


    fetchFolderContents(project_id, folder_id) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };
        this.http.get('	https://developer.api.autodesk.com/data/v1/projects/' + project_id + '/folders/' + folder_id + '/contents', httpOptions).subscribe((r) => { console.log(r); });


    }



    fetchItem(href) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };

        //href = href.replace('versions','items');
        this.http.get(href, httpOptions).subscribe((r) => { console.log(r); });


    }

    fetch(href) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };
        //href = href.replace('versions','items');
        this.http.get(href, httpOptions).subscribe((r) => { console.log(r); });
    }


    searchFolderContents(string) {
        console.log(string.target.value);
        string = encodeURI(string.target.value);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };


        this.searchResults$ = this.http.get('	https://developer.api.autodesk.com/data/v1/projects/' + this.projectID + '/folders/' + this.projectFolderId + '/search?filter[displayName]-contains=' + string, httpOptions)
            .pipe(map((r: any) => r.included));

    }


    getContentsOfAllProjects() {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };

        const requestArray: any = [];

        this.projectList.forEach(project => {
            //console.log(project);
            const temp = this.http.get('	https://developer.api.autodesk.com/data/v1/projects/' + project.id + '/folders/' + project.relationships.rootFolder.data.id + '/contents', httpOptions);
            requestArray.push(temp);
        });

        //console.log(requestArray);

        forkJoin(requestArray).pipe(map((resp: any) => resp.map(res => res.data))).subscribe(results => {

            //  console.log(results);
            this.topLevelresults = [];
            results.forEach(element => {
                console.log(element);
                if (element.length > 0) {
                    this.topLevelresults = this.topLevelresults.concat(element);
                }
            });
            this.searchResults$ = of (this.topLevelresults);
            this.gridApi.sizeColumnsToFit()
            console.log(this.topLevelresults);

        });



    }

    searchContentsOfAllProjects(event) {

      //  console.log(event.target.value);
      let string = null; 

    

      if(event && event.target.value !== '')
      {
           string = 'filter[displayName]-contains=' + encodeURI(event.target.value);
      }

      if(this.quantiamDrawingsToggle)
      {
        string = string + '&filter[displayName]-starts=' + encodeURI('Q-');
      }

        
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.tokenResponse.access_token
            })
        };

        

        const requestArray: any = [];

        this.projectList.forEach(project => {
            //console.log(project);
            const temp = this.http.get('	https://developer.api.autodesk.com/data/v1/projects/' + project.id + '/folders/' + project.relationships.rootFolder.data.id +
                '/search?' + string, httpOptions).pipe(map((res: any) => {


                res.data.forEach(element => {

                    element.project = project;

                });
                console.log(res);
                return res;
            }));
            requestArray.push(temp);
        });

        //console.log(requestArray);

        forkJoin(requestArray).pipe(map((resp: any) => resp.map(res => res.included))).subscribe(results => {

            console.log(results);
            this.allSearchResults = [];
            results.forEach(element => {
                console.log(element);
                if (typeof element !== 'undefined' && element.length > 0) {
                    this.allSearchResults = this.allSearchResults.concat(element);
                }
            });
            this.searchResults$ = of (this.allSearchResults);
            this.gridApi.sizeColumnsToFit();
            console.log(this.allSearchResults);

        });

    }


    toggleQuantiamDrawings() {
        this.quantiamDrawingsToggle = !this.quantiamDrawingsToggle;
        if (this.quantiamDrawingsToggle) {
            this.searchContentsOfAllProjects(null);

        } else {
            this.getContentsOfAllProjects();
        }

    }










    /// a way to display this --- a methiod to associate things in our DB with projects 

}