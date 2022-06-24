export default interface Category {
    id: number;
    parent_id?: number;
    name: string;
    priority: number;
    account_type: string;
    children?: Category[];
};
