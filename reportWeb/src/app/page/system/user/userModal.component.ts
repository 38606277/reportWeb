import { Component} from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { User } from './user.component';
import { Page,PageComponent} from '../../../common/page.component';
import { Http } from '@angular/http';
import { AppCommonService } from '../../../common/app-common';
import { BaseComponent } from '../../../common/base.component';
declare var $: any;
@Component({
    selector: 'user-modal',
    template: `
               <div class="modal-header">
                   <button type="button" class="pull-right close" (click)="cancelButton()">×</button>
                   <h3 class="modal-title">ERP用户查询</h3>
               </div>
               <div class="modal-body">
                    <div class="form-group">
                        <div class="col-md-4">
                            <input type="text" name="name" class="form-control" [(ngModel)]="user.userName" (keyup)="getErpUserList(null)" placeholder="输入查询用户名">
                        </div>
                    </div>
                   <table id="example" class="table table-hover datatable" cellspacing="0" width="100%">
                    <thead>
                    <tr>
                        <th class="col-md-1">选择</th>
                        <th class="col-md-1">用户名</th>
                        <th class="col-md-2">创建时间</th>
                        <th class="col-md-1">起始时间</th>
                        <th class="col-md-1">结束时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let user of userList" >
                        <td><input type="radio" [id]="user.userName" (click)="currentRadioSelect(user)"></td>
                        <td>{{user.userName}}</td>
                        <td>{{user.creationDate}}</td>
                        <td>{{user.startDate}}</td>
                        <td>{{user.endDate}}</td>
                    </tr>
                    </tbody>
                </table>
                <page-content [page]="page" (pagination)="getErpUserList($event)"></page-content>
               </div>
               <div class="modal-footer">
                   <button type="button" class="btn btn-primary" (click)="okButton()">确认</button>
                   <button type="button" class="btn btn-secondary" (click)="cancelButton()">取消</button>
               </div>
    `
})
export class UserModal extends BaseComponent implements ModalComponent<UserModalContext>
{
    context: UserModalContext;
    page: Page;
    user: User;
    // message;
    userList: Array<User>;
    retUser: User;
    constructor(private http: Http,private commonService:AppCommonService,public dialog: DialogRef<UserModalContext>) {
        super();
        this.context = dialog.context;
        this.page = new Page(5);
        this.user = new User();
        // this.message=this.context.message;
        this.getErpUserList(null);
    }

    getErpUserList(page)
    {
        if(page==null){
            this.page.startIndex=0;
            this.page.currentPage=0;
        }else{
            this.page=page;
        }
        //查询记录页数
        this.http.post(this.commonService.getReportServerPath()+"/formUser/getErpUserListTotalRows",this.user,{headers: this.commonService.getHeaders()}).toPromise().then(
            res => this.setTotalPage(this.page, parseInt(res.text()))
        );
         this.http.post(this.commonService.getReportServerPath()+"/formUser/getErpUserList",[this.user,this.page],{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    this.userList=res.json();
                    if(this.userList!=null&&this.userList.length!=0&&this.page.currentPage==0){
                        this.page.currentPage = 1;
                    }
                }
         );
    }

    currentRadioSelect(obj: User)
    {
        this.retUser = obj;
        $("input[type=radio]").each(function(i,e)
        {
            if(e.id!=obj.userName)
            {
                $(e).get(0).checked=false;
            }
        });
    }

    okButton(){
        this.dialog.close(this.retUser);
    }

    cancelButton(){
        this.dialog.dismiss();
    }
}

export class UserModalContext extends BSModalContext {
}

export class UserCloseGuard implements CloseGuard
{
    constructor(public domain:any){}

    beforeDismiss(){
        // this.domain.cancelButton();
        return false;
    }

    beforeClose(){
         this.domain.selectOk();
         return false;
    }
}