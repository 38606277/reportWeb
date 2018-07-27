import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'angular2-modal';
import { AppComponent } from './app.component';
import { routing } from './app-routing';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login.component';
import { AppCommonModule } from './common/appcommon.module';
import { DashboardComponent } from './page/dashboard.component';
import { ReportComponent } from './page/report/report.component';
import { IndexService } from './index.service';
import { SystemModule } from './page/system/system.module';
import { AppCommonService } from './common/app-common';
import { FormReportModule } from './page/form/form.module';
import { ReportModule } from './page/report/report.module';
import { AppService } from './app.service';
import { ThemeModule } from './page/theme/theme.module';
import { UserViewComponent } from './modal/userview.component';
import { RecursionComponent } from './page/report/recursion.component';
import { TemRecursionComponent } from './page/report/temrecursion.component';
import { BudgetRecursionComponent } from './page/report/budgetrecursion.component';

@NgModule({
  declarations: [IndexComponent,AppComponent,LoginComponent,UserViewComponent,RecursionComponent,
                  TemRecursionComponent,BudgetRecursionComponent],
  imports: [BrowserModule,routing,AppCommonModule,ModalModule.forRoot()],
  providers: [IndexService,AppCommonService,AppService],
  bootstrap: [AppComponent],
  entryComponents:[UserViewComponent]
}) 
export class AppModule { }