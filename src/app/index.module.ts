import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router';
import { AppCommonModule } from './common/appcommon.module';
import { DashboardComponent } from './page/dashboard.component';
import { ReportComponent } from './page/report/report.component';
import { TemReportComponent } from './page/report/temreport.component';

const INDEX_ROUTES:Routes = [
        { path: '',component: DashboardComponent},
        { path: 'web/:webFilePath',component: ReportComponent},
        { path: 'template/:webFilePath',component: TemReportComponent},
        { path: 'theme',loadChildren:'app/page/theme/theme.module#ThemeModule'},
        { path: 'report',loadChildren:'app/page/report/report.module#ReportModule'},
        { path: 'system',loadChildren:'app/page/system/system.module#SystemModule'},
        { path: 'form',loadChildren:'app/page/form/form.module#FormReportModule'}
];  

@NgModule({
    declarations:[DashboardComponent,ReportComponent,TemReportComponent],
    imports: [ RouterModule.forChild(INDEX_ROUTES),AppCommonModule],
    providers: [],
    exports: [ RouterModule ]
})
export class IndexModule{
}
