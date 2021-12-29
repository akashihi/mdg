package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Setting;

import java.util.Collection;

public record Settings(Collection<Setting> settings) {  }
