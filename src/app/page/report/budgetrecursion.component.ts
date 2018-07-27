import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
declare let $:any;
@Component({
    selector: '.budgetReportCursion',
    template: `<li *ngFor="let report of budgetReportTemplates" class="has_sub">
                  <a href="javascript:void(0);" *ngIf="!report.isReportFile" class="waves-effect"><span>{{report.func_name}}</span><span class="pull-right"><i class="md md-add"></i></span></a>
                  <a [routerLink]="['report/budget',report.func_id]" *ngIf="report.isReportFile" class="waves-effect"><span>{{report.func_name}}</span></a>
                  <ul *ngIf="report.children">
                     <li class="budgetReportCursion" [budgetReportTemplates]="report.children" class="has_sub"></li>
                  </ul>
               </li>`,
    styles:['.a_bg_color{background-color:#B5B5B5;}']

})
export class BudgetRecursionComponent {
    @Input() budgetReportTemplates;

    constructor() { }
}