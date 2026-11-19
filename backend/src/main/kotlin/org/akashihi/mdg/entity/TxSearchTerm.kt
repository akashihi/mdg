package org.akashihi.mdg.entity

import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.IdClass
import javax.persistence.Table

data class TxSearchTermId(var txId: Long = 0, var termId: Long = 0) : Serializable

@Entity
@Table(name = "tx_search_term")
@IdClass(TxSearchTermId::class)
class TxSearchTerm(
    @Id
    @Column(name = "tx_id")
    var txId: Long = 0,

    @Id
    @Column(name = "term_id")
    var termId: Long = 0
)
