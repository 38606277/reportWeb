import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router';

import { ZtreeComponent } from './ztree.component';
import { NetWorkFeeComponent } from './networkfee.component';
import { NewContractComponent } from './newcontract.component';
import { PurchaseComponent } from './purchase.component';
import { SignContractComponent } from './signcontract.component';
import { OrgListComponent } from './orgList.component';
import { ContractBudgetComponent } from './contractBudget.component';
import { ContractPaymentComponent } from './contractpayment.component';
import { ContractPaymentDetailComponent } from './contractpaymentdetail.component';
import { CertifiedComponent } from './certified.component';
import { UncertifiedComponent } from './uncertified.component';
import { StockBudgetComponent } from './stockbudget.component';
import { BudgetRelationComponent } from './budgetrelation.component';
import { AppCommonModule } from '../../common/appcommon.module';
import { BudgetReportComponent } from './budgetreport.component';

const REPORT_ROUTES:Routes = [
        { path: 'ztree',component: ZtreeComponent},
        { path: 'networkfee',component: NetWorkFeeComponent},
        { path: 'newcontract',component: NewContractComponent},
        { path: 'purchase',component: PurchaseComponent},
        { path: 'signcontract',component: SignContractComponent},
        { path: 'budgetRelation',component: BudgetRelationComponent},
        { path: 'orgList',component: OrgListComponent},
        { path: 'contractBudget',component: ContractBudgetComponent},
        { path: 'contractPayment',component: ContractPaymentComponent},
        { path: 'contractPaymentDetail',component: ContractPaymentDetailComponent},
        { path: 'certified',component: CertifiedComponent},
        { path: 'uncertified',component: UncertifiedComponent},
        { path: 'stockBudgetInfo',component: StockBudgetComponent},
        { path: 'budget/:func_id',component:BudgetReportComponent}
];

@NgModule({
    declarations:[NetWorkFeeComponent,NewContractComponent,PurchaseComponent,SignContractComponent,
                  BudgetRelationComponent,OrgListComponent,ContractBudgetComponent,ContractPaymentComponent,
                  ContractPaymentDetailComponent,CertifiedComponent,UncertifiedComponent,StockBudgetComponent,
                  BudgetReportComponent],
    imports: [ RouterModule.forChild(REPORT_ROUTES),AppCommonModule],
    providers: [],
    exports: [ RouterModule ]
})
export class ReportModule{
}
