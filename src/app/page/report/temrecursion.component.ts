import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
declare let $:any;
@Component({
    selector: '.temrecursion',
    template: `<li *ngFor="let report of myTemplates" class="has_sub">
                  <a href="javascript:void(0);" *ngIf="!report.isReportFile" class="waves-effect"><span>{{report.name}}</span><span class="pull-right"><i class="md md-add"></i></span></a>
                  <a [routerLink]="['template',report.path]" *ngIf="report.isReportFile" class="waves-effect"><span>{{report.name}}</span></a>
                  <ul *ngIf="report.children">
                     <li class="temrecursion" [myTemplates]="report.children" class="has_sub"></li>
                  </ul>
               </li>`,
    styles:['.a_bg_color{background-color:#B5B5B5;}']

})
export class TemRecursionComponent {
    @Input() myTemplates;

    constructor() { }
}