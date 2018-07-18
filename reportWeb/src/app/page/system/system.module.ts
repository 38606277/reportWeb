import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router';

import { UserComponent } from './user/user.component';
import { UserInfoComponent } from './user/userinfo.component';
import { DBComponent } from './db/db.component';
import { DbInfoComponent } from './db/dbinfo.component';
import { AuthTypeComponent } from './rule/authType.component';
import { AuthTypeInfoComponent } from './rule/authTypeInfo.component';
import { RuleComponent } from './rule/rule.component';
import { ExcelFileComponent } from './other/excelFile.component';
import { UploadFileComponent } from './other/uploadFile.component';
import { CacheComponent } from './cache/cache.component';
import { WebServiceComponent } from './webService/webService.component';
import { PromptModal } from '../../common/promptmodal.component';
import { UserIdValidator } from './user/userIdValidator';
import { UserNameValidator } from './user/userNameValidator';
import { DropdownTreeviewModule } from 'ng2-dropdown-treeview';
import { AppCommonModule } from '../../common/appcommon.module';
import { UserModal } from './user/userModal.component';
import { BalanceModal } from './cache/balanceModal.component';

const SYSTEM_ROUTES:Routes = [
        { path: 'user/userList',component: UserComponent},
        { path: 'user/:operType/:id',component: UserInfoComponent},
        { path: 'dbs',component: DBComponent},
        { path: 'dbs/:operType/:name',component: DbInfoComponent},
        { path: 'authType',component: AuthTypeComponent},
        { path: 'authType/:operType/:name',component: AuthTypeInfoComponent},
        { path: 'webService',component: WebServiceComponent},
        { path: 'rule',component: RuleComponent},
        { path: 'cache',component: CacheComponent},
        { path: 'excel',component: ExcelFileComponent},
        { path: 'uploadFile',component: UploadFileComponent}
];  

@NgModule({
    declarations:[DBComponent,DbInfoComponent,AuthTypeComponent,AuthTypeInfoComponent,UserNameValidator,UserIdValidator,CacheComponent,RuleComponent,
                  ExcelFileComponent,UploadFileComponent,UserComponent,UserInfoComponent,WebServiceComponent,
                  UserModal,BalanceModal],
    imports: [ RouterModule.forChild(SYSTEM_ROUTES),DropdownTreeviewModule.forRoot(),AppCommonModule],
    providers: [],
    exports: [ RouterModule],
    entryComponents:[UserModal,BalanceModal]
})
export class SystemModule{
}
