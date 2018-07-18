import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router';

import { IncomeComponent } from './income.component';
import { AssetComponent } from './asset.component';
import { CostComponent } from './cost.component';
import { PivotComponent } from './pivot.component';
import { AppCommonModule } from '../../common/appcommon.module';

const REPORT_ROUTES:Routes = [
        { path: 'income',component: IncomeComponent},
        { path: 'asset',component: AssetComponent},
        { path: 'cost',component: CostComponent},
        { path: 'pivot',component: PivotComponent},
];

@NgModule({
    declarations:[IncomeComponent,AssetComponent,CostComponent,PivotComponent],
    imports: [ RouterModule.forChild(REPORT_ROUTES),AppCommonModule],
    providers: [],
    exports: [ RouterModule ]
})
export class ThemeModule{
}
