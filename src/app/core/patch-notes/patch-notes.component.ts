import { Component, OnInit } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-patch-notes',
  templateUrl: './patch-notes.component.html',
  styleUrls: ['./patch-notes.component.css']
})
export class PatchNotesComponent implements OnInit {

  constructor(private markdownService: MarkdownService) { }

  ngOnInit() {


    
  }

}
