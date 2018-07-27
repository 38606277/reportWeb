import { Component} from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Cache } from './cache.component';
import { Page,PageComponent} from '../../../common/page.component';
import { Http } from '@angular/http';
import { AppCommonService } from '../../../common/app-common';
import { BaseComponent } from '../../../common/base.component';
declare var $: any;
@Component({
    template: `
               <div class="modal-header">
                   <button type="button" class="pull-right close" (click)="cancelButton()">×</button>
                   <h3 class="modal-title">缓存列表</h3>
               </div>
               <div class="modal-body">
                   <div class="table-responsive">
                   <div class="form-group">
                        <div class="col-md-5">
                            <input type="text" name="segment1" class="form-control" [(ngModel)]="segment1" (keyup)="getBalanceList(null)" placeholder="输入查询公司编码">
                        </div>
                   </div>
                      <table id="gl" *ngIf="cache.cacheType=='gl'" class="table table-hover datatable" cellspacing="0" width="100%">
                        <thead>
                          <tr>
                            <th class="col-md-1">segment1</th>
                            <th class="col-md-1">segment2</th>
                            <th class="col-md-1">segment3</th>
                            <th class="col-md-1">segment4</th>
                            <th class="col-md-1">segment5</th>
                            <th class="col-md-1">segment6</th>
                            <th class="col-md-1">segment7</th>
                            <th class="col-md-1">period_net_dr</th>
                            <th class="col-md-1">period_net_cr</th>
                            <th class="col-md-1">begin_balance_dr</th>
                            <th class="col-md-1">begin_balance_cr</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let balance of balanceList" >
                            <td>{{balance.segment1}}</td>
                            <td>{{balance.segment2}}</td>
                            <td>{{balance.segment3}}</td>
                            <td>{{balance.segment4}}</td>
                            <td>{{balance.segment5}}</td>
                            <td>{{balance.SEGMENT6}}</td>
                            <td>{{balance.segment7}}</td>
                            <td>{{balance.period_net_dr}}</td>
                            <td>{{balance.period_net_cr}}</td>
                            <td>{{balance.begin_balance_dr}}</td>
                            <td>{{balance.begin_balance_cr}}</td>
                          </tr>
                        </tbody>
                      </table>
                      <table id="allocate" *ngIf="cache.cacheType=='allocate'" class="table table-hover datatable" cellspacing="0" width="100%">
                        <thead>
                          <tr>
                            <th class="col-md-2">segment1</th>
                            <th class="col-md-2">segment3</th>
                            <th class="col-md-2">line_num</th>
                            <th class="col-md-2">period_net_cr</th>
                            <th class="col-md-2">period_net_bal</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let balance of balanceList" >
                            <td>{{balance.segment1}}</td>
                            <td>{{balance.segment3}}</td>
                            <td>{{balance.line_num}}</td>
                            <td>{{balance.period_net_cr}}</td>
                            <td>{{balance.period_net_bal}}</td>
                          </tr>
                        </tbody>
                      </table>
                      <page-content [page]="page" (pagination)="getBalanceList($event)"></page-content>
                   </div>
               </div>
               <div class="modal-footer">
                   <button type="button" class="btn btn-primary" (click)="okButton()">确认</button>
               </div>
    `
})
export class BalanceModal extends BaseComponent implements ModalComponent<BalanceModalContext>
{
    context: BalanceModalContext;
    page: Page;
    cache:Cache;
    balanceList: Array<any>;
    segment1: string;//查询条件
    lambdaWebservicePath: string;
    constructor(private http: Http,private commonService:AppCommonService,public dialog: DialogRef<BalanceModalContext>) {
        super();
        this.context = dialog.context;
        this.page = new Page(5);
        this.cache = this.context.cache;
        this.lambdaWebservicePath = this.context.lambdaWebservicePath;
        this.getBalanceList(null);
        
    }

    getBalanceList(page)
    {
        if(page==null){
            this.page.startIndex=0;
            this.page.currentPage=0;
        }else{
            this.page=page;
        }
        //查询记录页数
        this.http.post(this.lambdaWebservicePath+"/cache/getBalanceTotalRows",[this.cache,this.segment1],{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    console.log(res.text());
                     this.setTotalPage(this.page, parseInt(res.text()));
                }
        );
      
        this.http.post(this.lambdaWebservicePath+"/cache/getBalanceDetail",[this.cache,this.segment1,this.page],{headers: this.commonService.getHeaders()}).toPromise().then(
                res=>{
                    this.balanceList=res.json();
                    if(this.balanceList!=null&&this.balanceList.length!=0&&this.page.currentPage==0){
                        this.page.currentPage = 1;
                    }
                }
        );
    }

    okButton(){
        this.dialog.close();
    }

    cancelButton(){
        this.dialog.dismiss();
    }
}

export class BalanceModalContext extends BSModalContext {
    cache:Cache;
    lambdaWebservicePath: string;
}

export class BalanceCloseGuard implements CloseGuard
{
    constructor(){}

    beforeDismiss(){
        // this.domain.cancelButton();
        return false;
    }

    beforeClose(){
         //this.domain.selectOk();
         return false;
    }
}