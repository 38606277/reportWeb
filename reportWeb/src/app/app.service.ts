import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AppCommonService } from './common/app-common';

@Injectable()
export class AppService
{
	constructor(private http: Http,public commonService:AppCommonService) {
		
	}
	//先对密码加密再登录
	login(credentials): Promise<any>{
		return this.encodePwd(credentials).then(credentials=>{
			return this.http.post(this.commonService.getReportServerPath()+"/user/login",credentials,{headers: this.commonService.getHeaders()}).toPromise().then(
				res=>{return res.json()}
			);
		});
	}
	//直接登录(密码已经加密)
	loginDirect(credentials):Promise<any>{
		return this.http.post(this.commonService.getReportServerPath()+"/user/login",credentials,{headers: this.commonService.getHeaders()}).toPromise().then(
			res=>{return res.json()}
		);
	}
	//对密码加密
	private encodePwd(credentials){

		return this.http.post(this.commonService.getReportServerPath()+"/user/encodePwd",credentials.Pwd,{headers: this.commonService.getHeaders()}).toPromise().then(
			res=>{
				credentials.Pwd = res.json().encodePwd;
				return credentials}
		);
	}
	comdify(n){
	　　var num = n.toString();   //将输入的数字转换为字符串  
  
		if(/^-?\d+\.?\d+$/.test(num)){  //判断输入内容是否为整数或小数  
			if(/^-?\d+$/.test(num)){    //判断输入内容是否为整数 包含负数和正数  
				num =num + ",00";   //将整数转为精度为2的小数，并将小数点换成逗号  
			}else{  
				num = num.toString().replace(/\./,',');    //将小数的小数点换成逗号  
			}  
	
			while(/\d{4}/.test(num)){ //  
				/***  
				 *判断是否有4个相连的数字，如果有则需要继续拆分，否则结束循环；  
				*将4个相连以上的数字分成两组，第一组$1是前面所有的数字（负数则有符号），  
				*第二组第一个逗号及其前面3个相连的数字；  
				* 将第二组内容替换为“,3个相连的数字，”  
				***/  
				num = num.replace(/(\d+)(\d{3}\,)/,'$1,$2');  
			}  
	
			num = num.replace(/\,(\d*)$/,'.$1');   //将最后一个逗号换成小数点  
	        return num;  
		}else {  
			num = '0.00';  
			return num;
		}  
	}
	
}