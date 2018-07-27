import { Component,OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { AppService } from './app.service';
import { CookieService } from 'ngx-cookie';
@Component({
    templateUrl: './login.component.html',
	providers: [AppService]
})
export class LoginComponent implements OnInit{

        credentials = {UserCode:'',Pwd:'',isAdmin:0,import:''};
	errMsg: string;
	loginByCookies = false;
	isRemenberUserInfo = false;
	isCommiting: boolean = false; //是否正在提交，防止重复提交
	constructor(private router:Router,private appService:AppService,private cookieService:CookieService){}
	
	ngOnInit()
	{
		//从cookie中判断是否免登陆
		if(this.cookieService.get('credentials')!=null){
			this.isCommiting = true;
			this.credentials = JSON.parse(this.cookieService.get('credentials'));
			this.loginByCookies = true;
			this.login();
		}
	}

	login()
	{
		if(this.loginByCookies){
			this.appService.loginDirect(this.credentials).then(
				result=>{
					this.credentials.isAdmin = result.isAdmin;
					this.credentials.import = result.import;
					this.putIntoCookie(result);
					this.isCommiting = false;
				}
			);
		}else{
			this.isCommiting = true;
			this.appService.login(this.credentials).then(
				result=>{
					this.credentials.isAdmin = result.isAdmin;
					this.credentials.import = result.import;
					this.putIntoCookie(result);
					this.isCommiting = false;
				}
			);
		}
	}
	//重置错误消息
	resetMsg()
	{
		this.errMsg = "";
	}

	private putIntoCookie(result)
	{
		let loginResult = result.LOGINRESULT;
		if("Y"==loginResult){
			//是否存放用户信息到cookie,如果选择记住密码,密码保存3天,否则保存3个小时
			if(this.isRemenberUserInfo)
			{
				let Days = 3;
				let exp = new Date();
				exp.setTime(exp.getTime() + Days*24*60*60*1000);
				this.cookieService.put('credentials',JSON.stringify(this.credentials),{'expires':exp});
			}
			else if(!this.isRemenberUserInfo&&!this.loginByCookies)
			{
				let Days = 3/24;
				let exp = new Date();
				exp.setTime(exp.getTime() + Days*24*60*60*1000);
				this.cookieService.put('credentials',JSON.stringify(this.credentials),{'expires':exp});
			}
			this.router.navigate(['index']);
		}else if("N"==loginResult)
		{
			this.errMsg = "用户密码错误";
			this.cookieService.remove('credentials');
			this.loginByCookies = false;
			this.router.navigate(['']);
		}
		else if("InvalidUser"==loginResult)
		{
			this.errMsg = "用户名不存在";
			this.cookieService.remove('credentials');
			this.loginByCookies = false;
			this.router.navigate(['']);
		}
		else if("Exception"==loginResult)
		{
			this.errMsg = "发生异常,"+result.Message;
			this.cookieService.remove('credentials');
			this.loginByCookies = false;
			this.router.navigate(['']);
		}
	}

}