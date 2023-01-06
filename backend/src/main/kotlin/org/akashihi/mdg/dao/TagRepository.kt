package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Tag
import org.springframework.data.jpa.repository.JpaRepository

interface TagRepository : JpaRepository<Tag, Long> {
    fun findByTag(tag: String): Tag?
}