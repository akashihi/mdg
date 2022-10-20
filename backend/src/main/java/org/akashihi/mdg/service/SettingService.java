package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.MdgException;
import org.akashihi.mdg.dao.CurrencyRepository;
import org.akashihi.mdg.dao.SettingRepository;
import org.akashihi.mdg.entity.Currency;
import org.akashihi.mdg.entity.Setting;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SettingService {
    private final CurrencyRepository currencyRepository;
    private final SettingRepository settingRepository;

    public Collection<Setting> list() {
        return settingRepository.findAll(Sort.by("id"));
    }

    @Cacheable(value="settingsCache", key="#result.id", condition = "#result != null")
    public Optional<Setting> get(String name) {
        return settingRepository.findById(name);
    }

    @CacheEvict(value = "settingsCache", key="#result.id")
    public Setting updateUiTransactionCloseDialog(String newValue) {
        if (!"true".equalsIgnoreCase(newValue) && !"false".equalsIgnoreCase(newValue)) {
            throw new MdgException("SETTING_DATA_INVALID", 422, "/settings/ui.transaction.closedialog");
        }
        var setting = settingRepository.findById("ui.transaction.closedialog").orElseThrow(() -> new MdgException("SETTING_NOT_FOUND", 404, "/settings/ui.transaction.closedialog"));
        setting.setValue(newValue);
        settingRepository.save(setting);
        return setting;
    }

    @CacheEvict(value = "settingsCache", key="#result.id")
    public Setting updateCurrencyPrimary(String newValue) {
        try {
            var currencyID = Long.parseLong(newValue);
            if (!currencyRepository.existsById(currencyID)) {
                throw new MdgException("SETTING_DATA_INVALID", 422, "/settings/currency.primary");
            }

            var setting = settingRepository.findById("currency.primary").orElseThrow(() -> new MdgException("SETTING_NOT_FOUND", 404, "/settings/currency.primary"));
            setting.setValue(newValue);
            settingRepository.save(setting);
            return setting;
        } catch (NumberFormatException ex) {
            throw new MdgException("SETTING_DATA_INVALID", 422, "/settings/currency.primary", ex);
        }
    }

    @CacheEvict(value = "settingsCache", key="#result.id")
    public Setting updateUiLanguage(String newValue) {
        var setting = settingRepository.findById("ui.language").orElseThrow(() -> new MdgException("SETTING_NOT_FOUND", 404, "/settings/ui.language"));
        setting.setValue(newValue);
        settingRepository.save(setting);
        return setting;
    }

    @Transactional
    @Cacheable(value="settingsCache", key="#result.id", condition = "#result != null")
    public Optional<Currency> getCurrentCurrencyPrimary() {
        return this.get("currency.primary").flatMap(id -> {try {
            return Optional.of(Long.parseLong(id.getValue()));
        } catch (Exception e) {
            return Optional.empty();
        }}).flatMap(currencyRepository::findById);
    }
}
