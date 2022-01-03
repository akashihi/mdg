package org.akashihi.mdg.api.v1.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.akashihi.mdg.entity.Account;

import java.util.Collection;

public record CategoryTreeEntry(@JsonInclude(JsonInclude.Include.NON_NULL) Long id, @JsonInclude(JsonInclude.Include.NON_NULL) String name, Collection<Account> accounts, Collection<CategoryTreeEntry> categories) { }
