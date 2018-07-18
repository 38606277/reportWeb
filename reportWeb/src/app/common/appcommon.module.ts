import { NgModule } from '@angular/core';
import { SimplePageComponent } from './simplepage.component';
import { PageComponent } from './page.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'angular2-modal';
import { CommonModule }     from '@angular/common';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { PromptModal } from './promptmodal.component';
import { CookieModule } from 'ngx-cookie';
import { ExcelService } from './excelservice.component';
import { ZtreeComponent } from '../page/report/ztree.component';
@NgModule({
    declarations:[SimplePageComponent,PageComponent,PromptModal,ZtreeComponent],
    imports:[FormsModule,HttpModule,BootstrapModalModule,CommonModule,CookieModule.forRoot()],
    exports:[FormsModule,HttpModule,BootstrapModalModule,CommonModule,SimplePageComponent,PageComponent,CookieModule],
    providers:[ExcelService],
    entryComponents:[PromptModal]
})
export class AppCommonModule{

}