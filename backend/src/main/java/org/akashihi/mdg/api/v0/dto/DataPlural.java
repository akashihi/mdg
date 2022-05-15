package org.akashihi.mdg.api.v0.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Collection;

@Data
@RequiredArgsConstructor
public class DataPlural<T>{
    private final Collection<T> data;
    private final Integer count;

    public DataPlural(Collection<T> data) {
        this.data = data;
        this.count = 0;
    }
}
