package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Transaction;

import java.util.Collection;

public record Transactions(Collection<Transaction> transactions, String self, String first, String next, Long left) { }
