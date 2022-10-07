export interface Category {
    readonly id: number;
    readonly parent_id?: number;
    readonly name: string;
    readonly priority: number;
    readonly account_type: string;
    readonly children?: Category[];
}
