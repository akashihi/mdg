package org.akashihi.mdg.entity

import javax.persistence.Entity
import javax.persistence.Id

@Entity
class Error (
    val status: Int,
    val title: String,
    val detail: String,
    @Id
    val code: String
)