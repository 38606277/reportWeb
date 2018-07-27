import { Component , OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
declare var $:any;
@Component({
    template:''
})
export class StockBudgetComponent implements OnInit{
    constructor(private http: Http,private commonService:AppCommonService) {}
    ngOnInit(){
        this.http.post(this.commonService.getReportServerPath()+"/budget/getStockBudgetInfo",null,{headers: this.commonService.getHeaders()}).toPromise().then(
          res => window.open(res.text())
	  	);
    }
}