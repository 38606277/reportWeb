import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router,ActivatedRoute} from '@angular/router';
import { overlayConfigFactory } from 'angular2-modal';
import { Modal,BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CloseGuard } from 'angular2-modal';
import { AppCommonService } from '../../../common/app-common';
import { BaseComponent } from '../../../common/base.component';
import { Page } from '../../../common/page.component';
import { PromptModal,PromptModalContext,PromptCloseGuard} from '../../../common/promptmodal.component';

@Component({
    templateUrl: './user.component.html',
    styles: ['.table th{ text-align: center;}','.table td{ text-align: center;}']
})
export class UserComponent extends BaseComponent{
    userList: Array<User>;
    user: User;
    page: Page;
    id: number; //user表主键

    constructor(private http: Http,private commonService:AppCommonService,private router:Router,
                private modal: Modal,private route: ActivatedRoute) {
        super();
        this.user = new User();
        this.page = new Page(10);
        this.user.userName = route.snapshot.queryParams['userName'];
        this.getUserList(null);
    }

    getUserList(page){
        if(page==null){
            this.page.startIndex=0;
            this.page.currentPage=0
        }else{
            this.page=page;
        }
        //查询记录页数
        this.http.post(this.commonService.getReportServerPath()+"/formUser/getUserListTotalRows",this.user,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => this.setTotalPage(this.page, parseInt(res.text()))
        );
        //查询记录数
        this.http.post(this.commonService.getReportServerPath()+"/formUser/getUserList",[this.user,this.page],{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                this.userList = res.json();
                if(this.userList!=null&&this.userList.length!=0&&this.page.currentPage==0){
                        this.page.currentPage = 1;
                }
            }
		);
    }
    
    deleteUser(id)
    {
        this.openCustom(id);
    } 

    openCustom(id)
    {
        this.id = id;
        let pContext = new PromptModalContext();
        pContext.message = "确定删除该条记录?";
        // pContext.showClose = true;
        let guard = new PromptCloseGuard(this);
        this.modal.open(PromptModal, overlayConfigFactory(pContext, BSModalContext)).then(
            dialogref=>{
                dialogref.setCloseGuard(guard)
            }
        );
    }
    
    okButton()
    {
        this.http.post(this.commonService.getReportServerPath()+"/formUser/deleteUser",this.id,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                let pContext = new PromptModalContext();
                if("success"==res.text()){
                    pContext.message = "删除成功.";
                }
                else{
                    pContext.message = "删除失败.";
                }
                this.modal.open(PromptModal, overlayConfigFactory(pContext, BSModalContext));
                this.getUserList(null);
            }
        );
    }

    cancelButton(){}
}

export class User{
    id;
    userId;
    userName;
    isAdmin;
    isAdminText;//eg:管理员、用户
    creationDate;
    startDate;
    endDate;
    description;
    regisType;
    encryptPwd;
    ensurePwd;
    toString(){
        return "{id="+this.id+",userId="+this.userId+",userName="+this.userName+",creationDate="+this.creationDate+",startDate="+this.startDate+
               ",endDate="+this.endDate+",description="+this.description+",regisType="+this.regisType+",encryptPwd="+this.encryptPwd+",ensurePwd="+this.ensurePwd+"}";
    }
}

