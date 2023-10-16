export type SettingKey = 'currency.primary' | 'ui.transaction.closedialog' | 'ui.language' | 'mnt.transaction.reindex' | 'ui.overviewpanel.widgets';

export interface Setting {
    readonly id: SettingKey;
    readonly value: string;
}

export type OverviewPanels = "accounts" | "finance" | "asset" | "budget" | "transactions"

export interface OverviewSetting {
    readonly lt: OverviewPanels,
    readonly rt: OverviewPanels,
    readonly lb: OverviewPanels,
    readonly rb: OverviewPanels,
}
