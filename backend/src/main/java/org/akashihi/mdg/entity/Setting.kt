package org.akashihi.mdg.entity

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id

@Entity
class Setting(
    var value: String,
    @Id
    @Column(name = "name")
    val id: String? = null
)
