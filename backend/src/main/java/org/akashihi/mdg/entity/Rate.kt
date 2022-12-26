package org.akashihi.mdg.entity;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.akashihi.mdg.api.v1.json.TsSerializer;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
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
    @JsonSerialize(using = TsSerializer.class)
    private LocalDateTime beginning;
    @Column(name = "rate_end")
    @JsonSerialize(using = TsSerializer.class)
    private LocalDateTime end;
    @Column(name = "from_id")
    private Long from;
    @Column(name = "to_id")
    private Long to;
    private BigDecimal rate;
}
