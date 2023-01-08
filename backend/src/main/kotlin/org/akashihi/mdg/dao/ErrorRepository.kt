package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Error
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ErrorRepository : JpaRepository<Error, String>
