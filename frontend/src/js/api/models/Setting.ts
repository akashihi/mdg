type SettingKey = "currency.primary" | "ui.transaction.closedialog" | "ui.language" | "mnt.transaction.reindex"

export interface Setting {
    readonly id: SettingKey;
    readonly value: string;
}
