import { Component } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import {Headers,Http} from '@angular/http';
import { AppCommonService } from '../../common/app-common';
declare var $:any;
@Component({
    template:''
})
export class BudgetReportComponent{
    routers = {'106':'/index/report/ztree',
               '107':'/index/report/networkfee',
               '108':'/index/report/purchase',
               '109':'/index/report/signcontract',
               '110':'/index/report/orgList',
               '112':'/index/report/newcontract',
               '113':'/index/report/contractPayment',
               '114':'/index/report/contractPaymentDetail',
               '115':'/index/report/contractBudget',
               '117':'/index/report/stockBudgetInfo',
               '118':'/index/report/budgetRelation',
               '120':'/index/report/certified',
               '121':'/index/report/uncertified'};
    constructor(private http: Http,private appCommonService:AppCommonService,
                private router:Router,private route: ActivatedRoute) {
        route.params.subscribe(
            param=>{
                let func_id = param['func_id'];
                this.router.navigate([this.routers[func_id]]);
            }
        );
    }
    
}