package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Settings;
import org.akashihi.mdg.entity.Setting;
import org.akashihi.mdg.indexing.IndexingService;
import org.akashihi.mdg.service.SettingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SettingController {
    private final SettingService settingService;
    private final IndexingService indexingService;


    @GetMapping(value = "/settings", produces = "application/vnd.mdg+json;version=1")
    Settings list() {
        return new Settings(settingService.list());
    }

    @GetMapping(value = "/settings/{id}", produces = "application/vnd.mdg+json;version=1")
    Setting get(@PathVariable("id") String id) {
        return settingService.get(id).orElseThrow(() -> new RestException("SETTING_NOT_FOUND", 404, "/settings/%s".formatted(id)));
    }

    @PutMapping(value = "/settings/ui.transaction.closedialog", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Setting updateUiTransactionCloseDialog(@RequestBody Setting setting) {
        return settingService.updateUiTransactionCloseDialog(setting.getValue());
    }

    @PutMapping(value = "/settings/currency.primary", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Setting updateCurrencyPrimary(@RequestBody Setting setting) {
        return settingService.updateCurrencyPrimary(setting.getValue());
    }

    @PutMapping(value = "/settings/ui.language", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Setting updateUiLanguage(@RequestBody Setting setting) {
        return settingService.updateUiLanguage(setting.getValue());
    }

    @PutMapping(value = "/settings/mnt.transaction.reindex", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Setting transactionReindex() {
        var language = settingService.get("ui.language").map(Setting::getValue).orElse("en");
        indexingService.reIndex(language);
        return new Setting("mnt.transaction.reindex", "true");
    }
}
