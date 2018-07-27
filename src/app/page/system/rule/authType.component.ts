import { Component } from '@angular/core';
import { Page } from '../../../common/page.component';
import { BaseComponent } from '../../../common/base.component';
import { Http } from '@angular/http';
import { Router} from '@angular/router';
import { Modal,BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { AppCommonService } from '../../../common/app-common';
import { PromptModal,PromptModalContext,PromptCloseGuard} from '../../../common/promptmodal.component';
import { overlayConfigFactory } from 'angular2-modal';

@Component({
    templateUrl: './authType.component.html',
    styles: ['.table th{ text-align: center;}','.table td{ text-align: center;}']
})
export class AuthTypeComponent extends BaseComponent{
    authTypeList:any;
    name: string; //删除时用到
    constructor(private http: Http,private commonService:AppCommonService,private router:Router,
                private modal: Modal) {
        super();
        this.getAllAuthTypeList();
     }

     getAllAuthTypeList()
     {
        //查询记录数
        this.http.post(this.commonService.getReportServerPath()+"/authType/getAllAuthTypeList",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                this.authTypeList = res.json().data;
            }
		);
     }

     deleteDB(name)
     {
         this.openCustom(name);
     }

     openCustom(name)
     {
        this.name = name;
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
        this.http.post(this.commonService.getReportServerPath()+"/authType/deleteAuthType",this.name,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                let pContext = new PromptModalContext();
                if("1000"==res.json().resultCode){
                    pContext.message = "删除成功.";
                }
                else{
                    pContext.message = "删除失败.";
                }
                this.modal.open(PromptModal, overlayConfigFactory(pContext, BSModalContext));
                this.getAllAuthTypeList();
            }
        );
     }

     cancelButton(){}
}


