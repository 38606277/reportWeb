import { Component} from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'prompt-modal',
    template: `
               <div class="modal-header">
                   <button type="button" class="pull-right close" (click)="cancelButton()">×</button>
                   <h3 class="modal-title">提示</h3>
               </div>
               <div class="modal-body">
                   <h4>{{message}}</h4>
               </div>
               <div class="modal-footer">
                   <button type="button" class="btn btn-primary" (click)="okButton()">确认</button>
                   <button type="button" class="btn btn-secondary" (click)="cancelButton()">取消</button>
               </div>
    `
})
export class PromptModal implements ModalComponent<PromptModalContext>
{
    context: PromptModalContext;
    message;
    constructor(public dialog: DialogRef<PromptModalContext>) {
        this.context = dialog.context;
        this.message=this.context.message;
    }

    okButton(){
        this.dialog.close();
    }

    cancelButton(){
        this.dialog.dismiss();
    }
}

export class PromptModalContext extends BSModalContext {}

export class PromptCloseGuard implements CloseGuard
{
    constructor(public domain:any){}

    beforeDismiss(){
        this.domain.cancelButton();
        return false;
    }

    beforeClose(){
         this.domain.okButton();
         return false;
    }
}