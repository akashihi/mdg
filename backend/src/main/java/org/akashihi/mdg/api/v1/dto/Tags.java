package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Tag;

import java.util.Collection;

public record Tags(Collection<Tag> tags) { }
