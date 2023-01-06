package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Setting
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository

@Repository
@Component
interface SettingRepository : JpaRepository<Setting?, String?>
