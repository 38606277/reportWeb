import { Component,OnInit,AfterViewInit} from '@angular/core';
import { Http } from '@angular/http';
import { Router,ActivatedRoute} from '@angular/router';
import { Modal,BSModalContext  } from 'angular2-modal/plugins/bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { BaseComponent } from '../../../common/base.component';
import { AppCommonService } from '../../../common/app-common';
import { User } from './user.component';
import { PromptCloseGuard } from '../../../common/promptmodal.component';
import { UserModal,UserModalContext ,UserCloseGuard} from './userModal.component';
import { overlayConfigFactory } from 'angular2-modal';
import { DialogRef} from 'angular2-modal';
declare var $: any;
@Component({
    templateUrl: './userinfo.component.html',
    styles:[`.border_c{border:1px solid #CCCCCC;}
             #userName{margin-left:10px;}
             #isAdmin,#regisType{height:35px;width:150px;padding-left:10px;}
             #isAdmin,#regisType,#search,input{border-color:#D3D3D3;}`]
})
export class UserInfoComponent extends BaseComponent implements OnInit,AfterViewInit{
    user: User = new User();
    operTitle ;
    operType: string;   //操作类型,新增/修改/查看
    id: number;
    userName: string;   //查询条件
    userRoles: Array<UserRole>;
    userImports: Array<UserImport>;//用户来源
    dialog:DialogRef<any>;
    constructor(private http: Http,private commonService:AppCommonService,
                private router:Router,private route: ActivatedRoute,
                private modal: Modal) {
        super();
        this.operType = route.snapshot.params['operType'];
        this.id = route.snapshot.params['id'];
        this.userName = route.snapshot.queryParams['userName'];
    }

    ngOnInit()
    {
        this.initializeUserRoles();
        this.initializeUserImports();
        if(this.operType=="add"){
            this.operTitle = "新增用户";
        }else if(this.operType=="update"){
            this.operTitle = "修改用户";
        }else if(this.operType=="view"){
            this.operTitle = "查看用户";
        }
        if(this.operType!="add"){
            this.http.post(this.commonService.getReportServerPath()+"/formUser/getUserInfoById",this.id,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>this.user = res.json()
            )
        }
    }

    _submit()
    {
        this.user.startDate = $("#startDate").val();
        this.user.endDate = $("#endDate").val();
        if(this.operType=="add"){
            this.http.post(this.commonService.getReportServerPath()+"/formUser/addUser",this.user,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if("success"==res.json().result){
                        let guard = new PromptCloseGuard(this);
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>添加成功!</h4>')
                        .open().then(dialogref=>{
                           dialogref.setCloseGuard(guard);
                        });
                    }else{
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>'+res.json().errMsg+'</h4>')
                        .open();
                    }
                }
            )
        }else if(this.operType=="update"){
            this.http.post(this.commonService.getReportServerPath()+"/formUser/updateUser",this.user,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if("success"==res.text()){
                        let guard = new PromptCloseGuard(this);
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>修改成功!</h4>')
                        .open().then(dialogref=>{
                           dialogref.setCloseGuard(guard);
                        });
                    }else{
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>修改失败!</h4>')
                        .open();
                    }
                }
            )
        }
        
    }

    okButton(){
        this.router.navigate(['/index/system/user/userList'],{queryParams:{userName:this.userName}});
    }

    cancelButton(){
        this.router.navigate(['/index/system/user/userList'],{queryParams:{userName:this.userName}});
    }

    selectOk()
    {
         this.dialog.result.then(
             user=>{
                 this.user.userName=user.userName;
                 this.user.startDate=user.startDate;
                 this.user.endDate=user.endDate;
                 this.user.description=user.description;
             }
         );
    }

    ngAfterViewInit()
    {
        if(this.operType=='view')
        {
            return;
        }
        $('#startDate,#endDate').fdatepicker({
			format: 'yyyy/mm/dd',
            language:'zh-CN'
		});
    }

    selectChange(isAdmin)
    {
        this.user.isAdmin = isAdmin;
    }

    importSelectChange(regisType)
    {
       this.user.regisType=regisType;
    }

    showErpUsers()
    { 
        if(this.operType=='view')
        {
            return;
        }
        let pContext = new UserModalContext();
        let guard = new UserCloseGuard(this);
        
        this.modal.open(UserModal, overlayConfigFactory(pContext, BSModalContext)).then(
            dialogref=>{
                 dialogref.setCloseGuard(guard);
                 this.dialog =  dialogref;
            }
        );
    }

    private initializeUserRoles()
    {
        let arr = new Array<UserRole>();
        arr.push(new UserRole(1,"管理员"));
        arr.push(new UserRole(0,"普通用户"));
        this.userRoles = arr;
    }

    private initializeUserImports()
    {
        let arr = new Array<UserImport>();
        arr.push(new UserImport("erp","ERP用户"));
        arr.push(new UserImport("local","本地用户"));
        this.userImports = arr;
    }
}
export class UserRole{
    constructor(public roleType: number,public roleName: string)
    {
        this.roleType = roleType;
        this.roleName = roleName;
    }
}

export class UserImport{
    constructor(public importKey: string,public importValue: string)
    {
        this.importKey = importKey;
        this.importValue = importValue;
    }
}