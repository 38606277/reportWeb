import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router,ActivatedRoute} from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { AuthTypeComponent } from './authType.component';
import { BaseComponent } from '../../../common/base.component';
import { AppCommonService } from '../../../common/app-common';
import { PromptCloseGuard } from '../../../common/promptmodal.component';
declare var $: any;
@Component({
    templateUrl: './authTypeInfo.component.html',
    styles:[`#dbtype{height:35px;width:150px;padding-left:10px;}
              #dbtype,input{border-color:#D3D3D3;}`]
})
export class AuthTypeInfoComponent extends BaseComponent {

    operTitle: string;
    operType: string;   //操作类型,新增/修改/查看
    name: string;
    title: string = "";      //url输入提示信息
    dbtyps : Array<DBType>;
    authType: AuthType = new AuthType();
    constructor(private http: Http,private commonService:AppCommonService,
                private router:Router,private route: ActivatedRoute,
                private modal: Modal) {
        super();
        this.operType = route.snapshot.params['operType'];
        this.name = route.snapshot.params['name'];
        if(this.operType=="add"){
            this.operTitle = "新增权限类型";
        }else if(this.operType=="update"){
            this.operTitle = "修改权限类型";
        }else if(this.operType=="view"){
            this.operTitle = "查看权限类型";
        }
        if(this.operType!="add"){
            this.http.post(this.commonService.getReportServerPath()+"/authType/getAuthTypeListByName",this.name,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>
                {
                    console.log(res.json().data);
                    this.authType = res.json().data;
                    $("#auth_db").val(this.authType.auth_db);
                }
            )
        }
        this.initializeDBTypes();
    }   

    

    _submit()
    {
        
        if(this.operType=="add"){
            this.http.post(this.commonService.getReportServerPath()+"/authType/saveAuthType",this.authType,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if("1000"==res.json().resultCode){
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
                        .body('<h4>'+res.json().message+'</h4>')
                        .open();
                    }
                }
            )
        }else if(this.operType=="update"){
            this.http.post(this.commonService.getReportServerPath()+"/authType/updateAuthType",this.authType,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if(true==res.json().resultCode){
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
                        .body('<h4>'+res.json().message+'</h4>')
                        .open();
                    }
                }
            )
        }
        
    }

    okButton(){
        this.router.navigate(['/index/system/authType']);
    }

    cancelButton(){
        this.router.navigate(['/index/system/authType']);
    }
    private initializeDBTypes()
    {
        let arr = new Array<DBType>();
        this.http.post(this.commonService.getReportServerPath()+"/DBConnection/ListAll",null,{headers: this.commonService.getHeaders()}).toPromise().then(
            res=>
            {
                console.log(res.json());
                let dbtypsList = res.json();
                for(let db of dbtypsList){
                    arr.push(new DBType(db.name));

                }
            }
        )
        this.dbtyps = arr;
    }

}

export class DBType{
    constructor(public dbType: string)
    {
        this.dbType = dbType;
    }
}

export class AuthType{
    auth_db: string;
    auth_name: string;
    auth_sql: string;
    authtype_class: string;
    authtype_desc: string;
    authtype_id: any;
    authtype_name: string;
    use_object: string;

    toString(){
        return "{auth_db="+this.auth_db+",auth_name="+this.auth_name+",auth_sql="+this.auth_sql+
                ",authtype_class="+this.authtype_class+",authtype_desc="+this.authtype_desc+
               ",use_object="+this.use_object+"}";
    }
} 
