package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, String> { }
