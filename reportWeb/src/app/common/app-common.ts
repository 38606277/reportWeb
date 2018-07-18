import {Injectable} from '@angular/core';
import { Headers} from '@angular/http';
import { CookieService } from 'ngx-cookie';
@Injectable()
export class AppCommonService{

    private headers = new Headers({'Content-Type': 'application/json;charset=UTF-8'});
    constructor(private cookieService:CookieService){}

    getHeaders()
    {
         this.headers.set("credentials",this.cookieService.get("credentials"));
         return this.headers;
    }

    //获取report的url,e.g,http://localhost:8080/report
    getContextPath()
    {
	    var url = window.location.href;
	    return url.substring(0,url.indexOf("/",url.indexOf("/",url.indexOf("/",url.indexOf("/") + 1) + 1) + 1));
    }
    //获取reportServer的url
    getReportServerPath()
    {
        return "http://"+this.getCurrentRequestIp()+":8080/reportServer";
    }
    //获取ibas2插件的url
    getIbas2DownloadPath()
    {
        return "http://"+this.getCurrentRequestIp()+":8080/ibas2/install/iBas2.exe";
    }
    
    //获取静态报表文件请求URL
    getWebReportPath()
    {
        return "http://"+this.getCurrentRequestIp()+":8080/report/static";
    }

    //获取动态报表文件请求URL
    getDynamicReportPath()
    {
        return "http://"+this.getCurrentRequestIp()+":8080/report/dynamic";
    }

    private getCurrentRequestIp()
    {
        var url = window.location.href;
    	var ip = url.substring(url.indexOf("//")+2,url.indexOf(":",url.indexOf(":")+1));
        return ip;
    }
}