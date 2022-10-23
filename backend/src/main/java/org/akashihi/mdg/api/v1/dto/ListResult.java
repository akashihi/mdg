package org.akashihi.mdg.api.v1.dto;

import java.util.List;

public record ListResult<T>(List<T> items, Long left) {}

