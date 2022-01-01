package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Category;

import java.util.Collection;

public record Categories(Collection<Category> categories) { }
