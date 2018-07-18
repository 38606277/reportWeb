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
    templateUrl: './db.component.html',
    styles: ['.table th{ text-align: center;}','.table td{ text-align: center;}']
})
export class DBComponent extends BaseComponent{
    dbList: Array<DB>;
    db: DB;
    name: string; //删除时用到
    constructor(private http: Http,private commonService:AppCommonService,private router:Router,
                private modal: Modal) {
        super();
        this.db = new DB();
        this.getAllDBList();
     }

     getAllDBList()
     {
        //查询记录数
        this.http.post(this.commonService.getReportServerPath()+"/DBConnection/ListAll",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                this.dbList = res.json();
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
        this.http.post(this.commonService.getReportServerPath()+"/DBConnection/Delete",this.name,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                let pContext = new PromptModalContext();
                if(true==res.json().retCode){
                    pContext.message = "删除成功.";
                }
                else{
                    pContext.message = "删除失败.";
                }
                this.modal.open(PromptModal, overlayConfigFactory(pContext, BSModalContext));
                this.getAllDBList();
            }
        );
     }

     cancelButton(){}
}

export class DB{
    name: string;
    dbtype: string;
    driver: string;
    url: string;
    username: string;
    password: string;
    maxpoolsize: number;
    minpoolsize: number;

    toString(){
        return "{name="+this.name+",driver="+this.driver+",url="+this.url+",username="+this.username+",password="+this.password+
               ",maxpoolsize="+this.maxpoolsize+",minpoolsize="+this.minpoolsize+"}";
    }
} 