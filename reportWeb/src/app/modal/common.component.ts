import { CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class CustomModalContext extends BSModalContext {
    data:any;
}

export class CustomCloseGuard implements CloseGuard
{
    constructor(public domain:any){}

    beforeDismiss(){
        // this.domain.cancelButton();
        return false;
    }

    beforeClose(){
         this.domain.selectOk();
         return false;
    }
}