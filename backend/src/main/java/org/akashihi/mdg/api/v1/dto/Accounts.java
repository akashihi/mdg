package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Account;

import java.util.Collection;

public record Accounts(Collection<Account> accounts) { }
