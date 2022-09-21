package org.akashihi.mdg.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

public enum BudgetEntryMode {
    SINGLE,
    EVEN,
    PRORATED;

    public String toDbValue() {
        return this.name().toLowerCase(Locale.US);
    }

    public static BudgetEntryMode from(String status) {
        return BudgetEntryMode.valueOf(status.toUpperCase(Locale.US));
    }

    public static BudgetEntryMode from(Boolean even, Boolean prorated) {
        if (even && prorated) {
            return PRORATED;
        } else if (even) {
            return EVEN;
        } else {
            return SINGLE;
        }
    }

    public static BudgetEntryMode flatten(Collection<BudgetEntryMode> modes) {
        var presence = new HashSet<>(modes);
        if (!presence.contains(EVEN) && !presence.contains(SINGLE)) {
            return PRORATED;
        } else if (!presence.contains(SINGLE)) {
            return EVEN;
        } else {
            return SINGLE;
        }
    }
}
