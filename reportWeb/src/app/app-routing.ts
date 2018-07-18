import { Routes ,RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { ZtreeComponent } from './page/report/ztree.component';
import { IndexComponent } from './index.component';

const APP_ROUTES:Routes = [
    { path: '',component:LoginComponent},
    { path: 'report/ztree',component: ZtreeComponent, data: {preload: false}},
    { path: 'index',component: IndexComponent,loadChildren:'app/index.module#IndexModule'}
];
export const routing = RouterModule.forRoot(APP_ROUTES,{ useHash: true})