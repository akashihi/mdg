package org.akashihi.mdg.service

import org.akashihi.mdg.api.v1.MdgException
import org.akashihi.mdg.dao.CurrencyRepository
import org.akashihi.mdg.dao.SettingRepository
import org.akashihi.mdg.entity.Currency
import org.akashihi.mdg.entity.Setting
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*
import javax.transaction.Transactional

@Service
open class SettingService(@Autowired private val currencyRepository: CurrencyRepository, @Autowired private val settingRepository: SettingRepository) {
    open fun list(): Collection<Setting> = settingRepository.findAll(Sort.by("id")).filterNotNull()

    @Cacheable(value = ["settingsCache"], key = "#result.id", condition = "#result != null")
    open operator fun get(name: String): Setting? = settingRepository.findByIdOrNull(name)

    @CacheEvict(value = ["settingsCache"], key = "#result.id")
    open fun updateUiTransactionCloseDialog(newValue: String): Setting {
        if (!"true".equals(newValue, ignoreCase = true) && !"false".equals(newValue, ignoreCase = true)) {
            throw MdgException("SETTING_DATA_INVALID")
        }
        val setting = settingRepository.findByIdOrNull("ui.transaction.closedialog") ?: throw MdgException("SETTING_NOT_FOUND")
        setting.value = newValue
        settingRepository.save(setting)
        return setting
    }

    @CacheEvict(value = ["settingsCache"], key = "#result.id")
    open fun updateCurrencyPrimary(newValue: String): Setting {
        val exists = newValue.toLongOrNull()?.let { currencyRepository.existsById(it) }
        if (exists == null || !exists) {
            throw MdgException("SETTING_DATA_INVALID")
        }
        val setting = settingRepository.findByIdOrNull("currency.primary") ?: throw MdgException("SETTING_NOT_FOUND")
        setting.value = newValue
        settingRepository.save(setting)
        return setting
    }

    @CacheEvict(value = ["settingsCache"], key = "#result.id")
    open fun updateUiLanguage(newValue: String): Setting {
        val setting = settingRepository.findByIdOrNull("ui.language") ?: throw MdgException("SETTING_NOT_FOUND")
        setting.value = newValue
        settingRepository.save(setting)
        return setting
    }

    @Cacheable(value = ["settingsCache"], key = "#result.id", condition = "#result != null")
    @Transactional
    open fun currentCurrencyPrimary(): Optional<Currency> {
        return this["currency.primary"]?.let { it.value.toLongOrNull() }?.let { currencyRepository.findById(it) } ?: Optional.empty()
    }
}
