package org.akashihi.mdg.api.v0.dto;


import lombok.Data;

import java.util.Collection;

@Data
public class DataError {
    public record ErrorEntry(String code, Integer status) {};
    private final String type;
    private final Collection<ErrorEntry> errors;
}
