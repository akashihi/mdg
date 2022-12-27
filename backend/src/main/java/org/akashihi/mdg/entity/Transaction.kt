package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonProperty
import lombok.AllArgsConstructor
import lombok.Getter
import lombok.NoArgsConstructor
import lombok.Setter
import lombok.ToString
import java.time.LocalDateTime
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.OneToMany
import javax.persistence.OrderBy
import javax.persistence.Table

@Entity
@Table(name = "tx")
class Transaction (
    var comment: String? = null,

    @JsonProperty("timestamp")
    var ts: LocalDateTime,

    @ManyToMany
    @JoinTable(name = "tx_tags", joinColumns = [JoinColumn(name = "tx_id")], inverseJoinColumns = [JoinColumn(name = "tag_id")])
    var tags: MutableSet<Tag>,

    @OneToMany(mappedBy = "transaction")
    @OrderBy("id")
    var operations: Collection<Operation>,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
)