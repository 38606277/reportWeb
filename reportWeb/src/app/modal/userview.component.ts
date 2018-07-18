import { Component} from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Http } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { AppCommonService } from '../common/app-common';
import { BaseComponent } from '../common/base.component';
declare var $: any;
@Component({
    template: `
               <div class="modal-header">
                   <button type="button" class="pull-right close" (click)="cancelButton()">×</button>
                   <h3 class="modal-title">个人信息</h3>
               </div>
               <div class="modal-body">
                <form #f="ngForm">
                   <table id="example" class="table table-hover datatable" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th colspan="2" >基本信息修改</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>登录名</td><td>{{user_name}}</td>
                        </tr>
                        <tr>
                            <td>用户归属</td><td>{{import=='local'?'本地用户':'ERP用户'}}</td>
                        </tr>
                        <tr>
                            <td>旧密码</td><td><input type="password" [(ngModel)]="origin_pwd" name="origin_pwd" required [readonly]="import=='erp'"></td>
                        </tr>
                        <tr>
                            <td>新密码</td><td><input type="password" [(ngModel)]="modify_pwd" #modifyPwd name="modify_pwd" required [readonly]="import=='erp'"></td>
                        </tr>
                        <tr>
                            <td>重复新密码</td><td><input type="password" [(ngModel)]="ensure_pwd" #ensurePwd name="ensure_pwd" required [readonly]="import=='erp'"></td>
                        </tr>
                        <tr *ngIf="ensurePwd.value!=''&&ensurePwd.value!=modifyPwd.value">
                            <td></td>
                            <td style="color:red;">两个新密码不相等!</td>
                        </tr>
                    </tbody>
                  </table>
                </form>
               </div>
               <div class="modal-footer">
                   <button type="button" class="btn btn-primary" (click)="okButton()" [disabled]="!f.valid">保存</button>
                   <button type="button" class="btn btn-secondary" (click)="cancelButton()">关闭</button>
               </div>
    `
})
export class UserViewComponent extends BaseComponent implements ModalComponent<BSModalContext>
{
    user_name:string;
    import:string;
    origin_pwd:string;
    modify_pwd:string;
    ensure_pwd:string;
    constructor(private http: Http,private commonService:AppCommonService,private cookieService:CookieService,public dialog: DialogRef<BSModalContext>) {
        super();
        let credentials = JSON.parse(this.cookieService.get('credentials'));
        this.user_name = credentials.UserCode;
        this.import = credentials.import;
    }

    okButton(){
        let param = {
            user_name:this.user_name,
            origin_pwd:this.origin_pwd,
            modify_pwd:this.modify_pwd
        };
        this.http.post(this.commonService.getReportServerPath()+"/user/modifyPasswd",param,{headers: this.commonService.getHeaders()}).toPromise().then(
            res=>{
                this.dialog.close(res.json());
            }
        );
    }

    cancelButton(){
        this.dialog.dismiss();
    }
}

