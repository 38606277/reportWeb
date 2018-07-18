import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router';
import { AppCommonModule } from '../../common/appcommon.module';
import { ReportTaskComponent} from './reporttask.component';

const FORM_REPORT_ROUTES:Routes = [
        { path: 'task/:user_id/:report_id',component: ReportTaskComponent}
];  

@NgModule({
    declarations:[ReportTaskComponent],
    imports: [ RouterModule.forChild(FORM_REPORT_ROUTES),AppCommonModule],
    providers: [],
    exports: [ RouterModule ]
})
export class FormReportModule{
}
