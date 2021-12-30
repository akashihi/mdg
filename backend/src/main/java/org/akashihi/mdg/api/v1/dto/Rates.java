package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Rate;

import java.util.Collection;

public record Rates(Collection<Rate> rates) { }
