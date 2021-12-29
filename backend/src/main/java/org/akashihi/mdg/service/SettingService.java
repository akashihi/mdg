package org.akashihi.mdg.service;

import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.CurrencyRepository;
import org.akashihi.mdg.dao.SettingRepository;
import org.akashihi.mdg.entity.Setting;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Locale;
import java.util.Optional;

@Service
public class SettingService {
    private final CurrencyRepository currencyRepository;
    private final SettingRepository settingRepository;

    public SettingService(SettingRepository settingRepository, CurrencyRepository currencyRepository) {
        this.settingRepository = settingRepository;
        this.currencyRepository = currencyRepository;
    }

    public Collection<Setting> list() {
        return settingRepository.findAll(Sort.by("id"));
    }

    public Optional<Setting> get(String name) {
        return settingRepository.findById(name);
    }

    public Setting updateUiTransactionCloseDialog(String newValue) {
        if (!newValue.equalsIgnoreCase("true") && !newValue.equalsIgnoreCase("false")) {
            throw new RestException("SETTING_DATA_INVALID", 422, "/settings/ui.transaction.closedialog");
        }
        var setting = settingRepository.findById("ui.transaction.closedialog").orElseThrow(() -> new RestException("SETTING_NOT_FOUND", 404, "/settings/ui.transaction.closedialog"));
        setting.setValue(newValue);
        settingRepository.save(setting);
        return setting;
    }

    public Setting updateCurrencyPrimary(String newValue) {
        try {
            var currencyID = Long.parseLong(newValue);
            if (!currencyRepository.existsById(currencyID)) {
                throw new RestException("SETTING_DATA_INVALID", 422, "/settings/currency.primary");
            }

            var setting = settingRepository.findById("currency.primary").orElseThrow(() -> new RestException("SETTING_NOT_FOUND", 404, "/settings/currency.primary"));
            setting.setValue(newValue);
            settingRepository.save(setting);
            return setting;
        } catch (NumberFormatException ex) {
            throw new RestException("SETTING_DATA_INVALID", 422, "/settings/currency.primary");
        }
    }

    public Setting updateUiLanguage(String newValue) {
        var setting = settingRepository.findById("ui.language").orElseThrow(() -> new RestException("SETTING_NOT_FOUND", 404, "/settings/ui.language"));
        setting.setValue(newValue);
        settingRepository.save(setting);
        return setting;
    }
}
