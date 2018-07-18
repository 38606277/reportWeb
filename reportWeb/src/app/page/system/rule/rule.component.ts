import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../common/base.component';
import { Http } from '@angular/http';
import { Router,ActivatedRoute} from '@angular/router';
import { AppCommonService } from '../../../common/app-common';
import { SimplePage } from '../../../common/simplepage.component';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { TreeviewConfig, TreeviewItem, TreeviewI18n, OrderDownlineTreeviewEventParser, DownlineTreeviewItem } from 'ng2-dropdown-treeview';
import * as _ from 'lodash';
declare let $:any;
@Component({
    templateUrl: './rule.component.html'
})

export class RuleComponent extends BaseComponent {
    userList: any;
    ruleList: Array<Rule>;
    authList: Array<Auth>;    
    authTypeList: any;   
    type: any;
    authType: any;
    selected: any;
    rule: Rule;
    auth: Auth;
    userName: JSON;
    simplepage: SimplePage;
    constructor(private http: Http,private commonService:AppCommonService,private router:Router,private route: ActivatedRoute,private modal: Modal) {
        super();
        this.simplepage = new SimplePage(10);
        this.rule = new Rule();
        this.auth = new Auth();
        this.type = 'select';
        this.ruleList = new Array<Rule>();
        this.userName = route.snapshot.queryParams['userName'];
        this.getUserList();
        // this.http.post(this.commonService.getReportServerPath()+"/function/getFunctionAuthList/"+"sysadmin",null,{headers: this.commonService.getHeaders()}).toPromise().then(
        //     res => {
        //         console.log(res.json().data);
        //         this.http.post(this.commonService.getReportServerPath()+"/function/getFunctionAuthListByClass/"+"sysadmin"+"/"+"函数",null,{headers: this.commonService.getHeaders()}).toPromise().then(
        //             res => {
        //                 console.log("~~~~~~~~~");
        //                 console.log(res.json().data);
        //             }
        //         );
        //     }
        // );
     }
     getUserList(page?){
        if(page!=null){
            this.simplepage = page;
        }
        //查询记录页数
        this.http.post(this.commonService.getReportServerPath()+"/user/getUserListRows",[this.userName],{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                this.setTotalPageToSimple(this.simplepage, parseInt(res.text()))
            }
        );
         //查询记录数
        this.http.post(this.commonService.getReportServerPath()+"/user/getUserList",[this.simplepage,this.userName],{headers: this.commonService.getHeaders()}).toPromise().then(
            res => {
                this.userList = res.json();
                if(this.userList!=null&&this.userList.length!=0&&this.simplepage.currentPage==0){
                        this.simplepage.currentPage = 1;
                }
            }
		);
     }
     getRule(e?,userName?){
        if(e){
            $(".table td").removeClass("a_bg_color");
            $(e.target).parent().addClass("a_bg_color");
        }
        if(userName){
            this.userName = userName;  
        }
        this.getRuleList(this.type);
     }
     getAuthTypeRule(e?,userName?){
        if(e){
            $(".table td").removeClass("a_bg_color");
            $(e.target).parent().addClass("a_bg_color");
        }
        if(userName){
            this.userName = userName;  
        }
        this.getAuthTypeRuleList(this.authType);
     }
     getRuleList(type){
         if(this.userName){
            showLoading();
            if(type=='select'){
                this.http.post(this.commonService.getReportServerPath()+"/select/getSelectClassTree",null,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthListByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.getRuleChecked(this.ruleList,this.authList);
                                this.type = type;
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='template'){
                this.http.post(this.commonService.getReportServerPath()+"/template/getDirectory",null,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.getRuleChecked(this.ruleList,this.authList);
                                this.type = type;
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='function'){
                this.http.post(this.commonService.getReportServerPath()+"/function/getFunctionClass",null,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.getRuleChecked(this.ruleList,this.authList);
                                this.type = type;
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='func'){
                let param = {
                    'type':'excel'
                };
                this.http.post(this.commonService.getReportServerPath()+"/rule/getFunRuleList",param,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.getRuleChecked(this.ruleList,this.authList);
                                this.type = type;
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='webFunc'){
                let param = {
                    'type':'web'
                };
                this.http.post(this.commonService.getReportServerPath()+"/rule/getFunRuleList",param,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.getRuleChecked(this.ruleList,this.authList);
                                this.type = type;
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='OU'){
                this.http.post(this.commonService.getReportServerPath()+"/rule/getDataList",null,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthListByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.type = type;
                                this.getRuleChecked(this.ruleList,this.authList);
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='DM'){
                this.http.post(this.commonService.getReportServerPath()+"/rule/getDepartmentList",null,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.ruleList = res.json();
                        this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthListByConditions",[this.userName,type],{headers: this.commonService.getHeaders()}).toPromise().then(
                            res => {
                                this.authList = res.json();
                                this.type = type;
                                this.getRuleChecked(this.ruleList,this.authList);
                                stopLoading();
                            }
                        );
                    }
                );
            }
            if(type=='table'){
                this.type = type;
                this.bookItems = null;
                this.http.post(this.commonService.getReportServerPath()+"/authType/getAllAuthTypeList",null,{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        console.log(res.json().data);
                        this.authTypeList = res.json().data;
                    }
                );
            }
         }
     }
     getAuthTypeRuleList(authType){
         if(this.userName){
            showLoading();
            let param = {
                'authType': authType
            };
            this.authType = authType;
            this.http.post(this.commonService.getReportServerPath()+"/authType/getAuthTypeListByType",param,{headers: this.commonService.getHeaders()}).toPromise().then(
                res => {
                    this.ruleList = res.json().data;
                    this.http.post(this.commonService.getReportServerPath()+"/rule/getAuthListByConditions",[this.userName,authType],{headers: this.commonService.getHeaders()}).toPromise().then(
                        res => {
                            this.authList = res.json();
                            this.getRuleChecked(this.ruleList,this.authList);
                            stopLoading();
                        }
                    );
                }
            );
         }
     }
     getRuleChecked(ruleList: Array<Rule>,authList:Array<Auth>){
         this.ruleList = this.getChecked(ruleList,authList);
         this.bookItems = this.createBooks(ruleList);
         
     }
      getChecked(ruleList: Array<Rule>,authList:Array<Auth>){
         for(let rule of ruleList){
             if(authList.length>0){
                for(let auth of authList){
                    if(auth.funcId!=null&&auth.funcId!=''){
                        const str: string[] = auth.funcId.split("/");
                        if(str.length>0){
                            if(rule.name==auth.funcName||rule.value==auth.funcId){
                                rule.check = true;
                                break;
                            }else{
                                rule.check = false;
                            }
                        }
                    }
                }
             }else{
                 rule.check = false;
             }
             if(rule.children && rule.children.length>0){
                 this.getChecked(rule.children,authList);
             }
         }
         return ruleList;
     }
     saveRules(){
            if(this.type=='table'){
                this.http.post(this.commonService.getReportServerPath()+"/rule/saveAuthRules",[this.userName,this.authType,this.bookValue],{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.getAuthTypeRule();
                        this.modal.alert()
                                .okBtn('确定')
                                .showClose(true)
                                .title('提示')
                                .body('<h4>保存成功!</h4>')
                                .open();
                    }
                );
            }else{
                this.http.post(this.commonService.getReportServerPath()+"/rule/saveAuthRules",[this.userName,this.type,this.bookValue],{headers: this.commonService.getHeaders()}).toPromise().then(
                    res => {
                        this.getRule();
                        this.modal.alert()
                                .okBtn('确定')
                                .showClose(true)
                                .title('提示')
                                .body('<h4>保存成功!</h4>')
                                .open();
                    }
                );
            }
     }


     bookItems: TreeviewItem[];
     bookValue: string[];
     bookConfig: TreeviewConfig = {
         isShowAllCheckBox: true,
         isShowFilter: false,
         isShowCollapseExpand: true,
         maxHeight: 273
     };


    private createBooks(ruleList): TreeviewItem[] {
        const items: TreeviewItem[] = [];
        for (let rule of ruleList) {
            if(rule.children&&rule.children.length>0){
                const childrenItems: TreeviewItem[] = [];
                this.recursiveItems(rule.children,childrenItems);
                const item = new TreeviewItem({ text: rule.name, value: rule.value, checked: rule.check, children: childrenItems});
                items.push(item);
            }else{
                if(this.type=='OU'||this.type=='table'){
                    const item = new TreeviewItem({ text: rule.name+"-"+rule.value, value: rule.value, checked: rule.check});
                    items.push(item);
                }else{
                    const item = new TreeviewItem({ text: rule.name, value: rule.value, checked: rule.check});
                    items.push(item);
                }
            }
        };
        return items;
    }
    private recursiveItems(ruleList,aItems){
        for (let rule of ruleList) {
            if(rule.children&&rule.children.length>0){
                const childrenItems: TreeviewItem[] = [];
                this.recursiveItems(rule.children,childrenItems);
                const item = new TreeviewItem({ text: rule.name, value: rule.value, checked: rule.check, children: childrenItems});
                aItems.push(item);
            }else{
                const item = new TreeviewItem({ text: rule.name, value: rule.value, checked: rule.check});
                aItems.push(item);
            }
        }
    }
    
}


export class Rule{
    name: any;
    value: any;
    children: Array<Rule>;
    check: boolean;

    toString(){
        return "{name="+this.name+",value="+this.value+",check="+this.check+"}";
    }
} 
export class Auth{
    authId: string;
    authType: string;
    funcId: string;
    userId: string;
    userName: string;
    funcName: string;
    funcType: string;

    toString(){
        return "{authId="+this.authId+",authType="+this.authType+",funcId="+this.funcId+",userId="+this.userId+",userName="+this.userName+",funcName="+this.funcName+",funcType="+this.funcType+"}";
    }
} 