import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
declare let $:any;
@Component({
    selector: '.recursion',
    template: `<li *ngFor="let report of myReports" class="has_sub">
                  <a href="javascript:void(0);" *ngIf="!report.isReportFile" class="waves-effect"><span>{{report.name}}</span><span class="pull-right"><i class="md md-add"></i></span></a>
                  <a [routerLink]="['web',report.path]" *ngIf="report.isReportFile" class="waves-effect"><span>{{report.name}}</span></a>
                  <ul *ngIf="report.children">
                     <li class="recursion" [myReports]="report.children" class="has_sub"></li>
                  </ul>
               </li>`,
    styles:['.a_bg_color{background-color:#B5B5B5;}']

})
export class RecursionComponent {
    @Input() myReports;

    constructor() { }
}