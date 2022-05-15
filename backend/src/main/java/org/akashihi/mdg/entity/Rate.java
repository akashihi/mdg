package org.akashihi.mdg.entity;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@Table(name = "rates")
@NoArgsConstructor
@AllArgsConstructor
public class Rate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "rate_beginning")
    private LocalDateTime beginning;
    @Column(name = "rate_end")
    private LocalDateTime end;
    @Column(name = "from_id")
    private Long from;
    @Column(name = "to_id")
    private Long to;
    private BigDecimal rate;
}
