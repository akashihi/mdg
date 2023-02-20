package org.akashihi.mdg.api.v1

import org.akashihi.mdg.entity.Setting
import org.akashihi.mdg.indexing.IndexingService
import org.akashihi.mdg.service.ReportService
import org.akashihi.mdg.service.SettingService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

data class Settings(val settings: Collection<Setting>)

@RestController
class SettingController(private val settingService: SettingService, private val indexingService: IndexingService, private val reportService: ReportService) {
    @GetMapping(value = ["/settings"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(): Settings = Settings(settingService.list())

    @GetMapping(value = ["/settings/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: String): Setting = settingService[id] ?: throw MdgException("SETTING_NOT_FOUND")

    @PutMapping(value = ["/settings/ui.transaction.closedialog"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun updateUiTransactionCloseDialog(@RequestBody setting: Setting): Setting = settingService.updateUiTransactionCloseDialog(setting.value)

    @PutMapping(value = ["/settings/currency.primary"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun updateCurrencyPrimary(@RequestBody setting: Setting): Setting = settingService.updateCurrencyPrimary(setting.value)

    @PutMapping(value = ["/settings/ui.language"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun updateUiLanguage(@RequestBody setting: Setting): Setting = settingService.updateUiLanguage(setting.value)

    @PutMapping(value = ["/settings/mnt.transaction.reindex"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun transactionReindex(): Setting {
        val language = settingService["ui.language"]?.let { it.value } ?: "en"
        indexingService.reIndex(language)
        return Setting("mnt.transaction.reindex", "true")
    }

    @PutMapping(value = ["/settings/mnt.reporting.refresh"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun reportingRefresh(): Setting {
        reportService.refreshMQT()
        return Setting("mnt.transaction.reindex", "true")
    }}
