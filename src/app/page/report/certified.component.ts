import { Component , OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AppCommonService } from '../../common/app-common';
declare var $:any;
@Component({
    template:`<iframe id="contractFrame" name="contractFrame" 
    src="" scrolling="yes" width="100%" height="720px" frameborder="0"></iframe>`
})
export class CertifiedComponent implements OnInit{
    constructor(private http: Http,private commonService:AppCommonService) {}
    ngOnInit(){
        this.http.post(this.commonService.getReportServerPath()+"/budget/getCertified/certified",null,{headers: this.commonService.getHeaders()}).toPromise().then(
          res => $("#contractFrame").get(0).src = res.text()
	  	);
    }
}