package org.akashihi.mdg.api.v0.dto;

import java.util.Collection;

public record DataPlural<T>(Collection<T> data) { }
