export interface Problem {
    readonly status: number;
    readonly code: string;
    readonly title: string;
    readonly instance?: string;
    readonly detail?: string;
}
