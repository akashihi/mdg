package org.akashihi.mdg.entity

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import lombok.AllArgsConstructor
import lombok.Getter
import lombok.NoArgsConstructor
import lombok.Setter
import lombok.ToString
import org.akashihi.mdg.api.v1.json.TsSerializer
import java.math.BigDecimal
import java.time.LocalDateTime
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "rates")
class Rate(
    @Column(name = "rate_beginning")
    @JsonSerialize(using = TsSerializer::class)
    var beginning: LocalDateTime,

    @Column(name = "rate_end")
    @JsonSerialize(using = TsSerializer::class)
    var end: LocalDateTime,

    @Column(name = "from_id")
    val from: Long,

    @Column(name = "to_id")
    val to: Long,
    val rate: BigDecimal,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)