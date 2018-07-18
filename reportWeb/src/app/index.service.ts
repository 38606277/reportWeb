import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppCommonService } from './common/app-common';
import { BaseComponent } from './common/base.component';

@Injectable()
export class IndexService{
	constructor(private http: Http,public commonService:AppCommonService) {}

    getMyReports(){
        return this.http.post(this.commonService.getReportServerPath()+"/web/getDirectory",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res=>{
                return res.json();
            }
		);
    }

    getMyTemplates(){
        return this.http.post(this.commonService.getReportServerPath()+"/dynamicReport/getDirectory",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res=>{
                return res.json();
            }
		);
    }

    getIbas2DownloadPath(){
        return this.commonService.getIbas2DownloadPath();
    }

    qryMenuList(){
        return this.http.post(this.commonService.getReportServerPath()+"/user/qryMenuList",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              return res.json();
            }
        );
    }

    getBudgetReport(){
        return this.http.post(this.commonService.getReportServerPath()+"/user/getBudgetReport",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              return res.json();
            }
        );
    }
    //待办1和已办3
    getTaskList(status){
        return this.http.post(this.commonService.getReportServerPath()+"/formReport/myTask",{'status':status},{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
              return res.json().data;
            }
        );
    }
}