export interface Rate {
    readonly id: number;
    readonly from: number;
    readonly to: number;
    readonly rate: number;
    readonly beginning: Date;
    readonly end: Date;
    readonly currencyCode?: string;
}
