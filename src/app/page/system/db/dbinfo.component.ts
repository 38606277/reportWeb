import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router,ActivatedRoute} from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DB } from './db.component';
import { BaseComponent } from '../../../common/base.component';
import { AppCommonService } from '../../../common/app-common';
import { PromptCloseGuard } from '../../../common/promptmodal.component';
declare var $: any;
@Component({
    templateUrl: './dbinfo.component.html',
    styles:[`#dbtype{height:35px;width:150px;padding-left:10px;}
              #dbtype,input{border-color:#D3D3D3;}`]
})
export class DbInfoComponent extends BaseComponent {
    db: DB = new DB();
    operTitle ;
    operType: string;   //操作类型,新增/修改/查看
    name: string;
    dbtyps : Array<DBType>;
    title: string = "";      //url输入提示信息
    constructor(private http: Http,private commonService:AppCommonService,
                private router:Router,private route: ActivatedRoute,
                private modal: Modal) {
        super();
        this.operType = route.snapshot.params['operType'];
        this.name = route.snapshot.params['name'];
        if(this.operType=="add"){
            this.operTitle = "新增连接";
        }else if(this.operType=="update"){
            this.operTitle = "修改连接";
        }else if(this.operType=="view"){
            this.operTitle = "查看连接";
        }
        if(this.operType!="add"){
            this.http.post(this.commonService.getReportServerPath()+"/DBConnection/GetByName",this.name,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>
                {
                    this.db = res.json();
                    $("#dbtype").val(this.db.driver);
                }
            )
        }
       this.initializeDBTypes();
    }   

    selectChange(dbdriver)
    {
        this.db.driver = dbdriver;
        this.db.dbtype = $("select[id=dbtype]>option:selected").text();
        if(this.db.dbtype=='Oracle'){
            this.db.url = "jdbc:oracle:thin:@ip:port:xe";
        }else if(this.db.dbtype=='Mysql'){
            this.db.url = "jdbc:mysql://ip:port/xe";
        }else if(this.db.dbtype=='DB2'){
            this.db.url = "jdbc:db2://ip:port/xe";
        }else if(this.db.dbtype=='mongoDB'){
           this.db.url = "ip:port";
           this.db.username = '';
           this.db.password = '';
        }
    }
    //测试数据库连接
    test()
    {
        this.http.post(this.commonService.getReportServerPath()+"/DBConnection/test",[this.db,this.operType],{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if(true==res.json().retCode){
                        let guard = new PromptCloseGuard(this);
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>测试成功!</h4>')
                        .open();
                    }else{
                        this.modal.alert()
                        .okBtn('确定')
                        .showClose(true)
                        .title('提示')
                        .body('<h4>测试失败!</h4>')
                        .open();
                    }
                }
        )
        
    }

    _submit()
    {
        if(this.operType=="add"){
            this.http.post(this.commonService.getReportServerPath()+"/DBConnection/save",this.db,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if(true==res.json().retCode){
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
                        .body('<h4>添加失败!</h4>')
                        .open();
                    }
                }
            )
        }else if(this.operType=="update"){
            this.http.post(this.commonService.getReportServerPath()+"/DBConnection/update",this.db,{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    if(true==res.json().retCode){
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
        this.router.navigate(['/index/system/dbs']);
    }

    cancelButton(){
        this.router.navigate(['/index/system/dbs']);
    }

    private initializeDBTypes()
    {
        let arr = new Array<DBType>();
        arr.push(new DBType("Oracle","oracle.jdbc.OracleDriver"));
        arr.push(new DBType("Mysql","com.mysql.cj.jdbc.Driver"));
        arr.push(new DBType("DB2","com.ibm.db2.jcc.DB2Driver"));
        arr.push(new DBType("mongoDB",""));
        this.dbtyps = arr;
    }

}

export class DBType{
    constructor(public dbType: string,public dbDriver: string)
    {
        this.dbType = dbType;
        this.dbDriver = dbDriver;
    }
}