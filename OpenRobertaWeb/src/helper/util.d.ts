// JQuery definitions (these are defined at js side and need to be converted)
interface JQuery {
    openRightView(str:string, f:number);
    closeRightView(callback?:() => any);
}

export function clone(obj: any): any;

export function toFixedPrecision(value: any, precision: any): string;