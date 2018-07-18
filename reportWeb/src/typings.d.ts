/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
//start 
//jquery.qpp.js
declare var toggle_fullscreen: () => void;
declare function executeFunctionByName(functionName: any, context: any): any;
declare var w: any, h: any, dw: any, dh: any;
declare var changeptype: () => void;
declare var debounce: (func: any, wait: any, immediate: any) => () => any;
declare function resizeitems(): void;
declare function initscrolls(): void;
declare function toggle_slimscroll(item: any): void;
declare var wow: any;
declare var showLoading: () => void;
declare var stopLoading: () => void;
//jquery.app.js
//end
