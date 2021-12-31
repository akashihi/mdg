package org.akashihi.mdg.api.v0;

import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v0.dto.SettingData;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.api.v1.dto.Settings;
import org.akashihi.mdg.entity.Setting;
import org.akashihi.mdg.service.SettingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
public class SettingControllerV0 {
    private final SettingService settingService;

    public SettingControllerV0(SettingService settingService) {
        this.settingService = settingService;
    }

    @GetMapping(value = "/api/setting", produces = "application/vnd.mdg+json")
    DataPlural<SettingData> list() {
        return new DataPlural<>(settingService.list().stream().map((s) -> new SettingData(s.getId(), "setting", new SettingData.Attributes(s.getValue()))).toList());
    }

    @GetMapping(value = "/api/setting/{id}", produces = "application/vnd.mdg+json")
    DataSingular<SettingData> get(@PathVariable("id") String id) {
        var setting = settingService.get(id).orElseThrow(() -> new RequestException(404, "SETTING_NOT_FOUND"));
        return new DataSingular<>(new SettingData(setting.getId(), "setting", new SettingData.Attributes(setting.getValue())));
    }

    @PutMapping(value = "/api/setting/ui.transaction.closedialog", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<SettingData> updateUiTransactionCloseDialog(@RequestBody DataSingular<SettingData> setting) {
        var newSetting =  settingService.updateUiTransactionCloseDialog(setting.data().getAttributes().value());
        return new DataSingular<>(new SettingData(newSetting.getId(), "setting", new SettingData.Attributes(newSetting.getValue())));
    }

    @PutMapping(value = "/api/setting/currency.primary", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<SettingData> updateCurrencyPrimary(@RequestBody DataSingular<SettingData> setting) {
        try {
            var newSetting = settingService.updateCurrencyPrimary(setting.data().getAttributes().value());
            return new DataSingular<>(new SettingData(newSetting.getId(), "setting", new SettingData.Attributes(newSetting.getValue())));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle());
        }
    }

    @PutMapping(value = "/api/setting/ui.language", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<SettingData> updateUiLanguage(@RequestBody DataSingular<SettingData> setting) {
        var newSetting = settingService.updateUiLanguage(setting.data().getAttributes().value());
        return new DataSingular<>(new SettingData(newSetting.getId(), "setting", new SettingData.Attributes(newSetting.getValue())));
    }
}
