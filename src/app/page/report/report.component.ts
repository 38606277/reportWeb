import { Component } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {Headers,Http} from '@angular/http';
import { AppCommonService } from '../../common/app-common';
declare var $:any;
@Component({
    template:`<iframe id="reportFrame" name="reportFrame" 
    src="" scrolling="yes" width="100%" height="720px" frameborder="0"></iframe>`
})
export class ReportComponent {
    private webFilePath: string = "";//经过编码的文件全路径(eg,d:/XX/XX.html)
    private reportUrl: string = ""; //虚拟目录请求路径(eg,http://ip:8080/report/webfile)
    private webPath: string = "";   //虚拟目录实际路径(eg,d:/report/file/web/file)

    constructor(private http: Http,private appCommonService:AppCommonService,private route: ActivatedRoute) {
        route.params.subscribe(
            param=>{
                this.webFilePath = param['webFilePath'];
                //如果已经向服务器请求WEB路径和文件路径,则不再重复发送该请求
                if(this.reportUrl==""&&this.webPath==""){
                    this.http.post(this.appCommonService.getReportServerPath()+"/web/MyReportUrl",null,{headers: this.appCommonService.getHeaders()}).toPromise().then(
                        res=>{ 
                            this.reportUrl = this.appCommonService.getWebReportPath();
                            this.webPath = res.json().webPath;
                            $("#reportFrame").get(0).src = this.reportUrl + decodeURIComponent(decodeURIComponent(this.webFilePath)).replace(this.webPath,"");
                        }
                    );
                }else{
                    $("#reportFrame").get(0).src = this.reportUrl + decodeURIComponent(decodeURIComponent(this.webFilePath)).replace(this.webPath,"");
                }
            }
        );
    }
}