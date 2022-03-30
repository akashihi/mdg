package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    private Long id;

    @Column(name = "term_beginning")
    @JsonProperty("term_beginning")
    private LocalDate beginning;

    @Column(name = "term_end")
    @JsonProperty("term_end")
    private LocalDate end;
}
