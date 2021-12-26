package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Currency;

import java.util.Collection;

public record Currencies(Collection<Currency> currencies) { }
