package org.akashihi.mdg.entity

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import lombok.Getter
import lombok.NoArgsConstructor
import lombok.Setter
import lombok.ToString
import org.akashihi.mdg.api.v1.json.TagDeserializer
import org.akashihi.mdg.api.v1.json.TagSerializer
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@JsonSerialize(using = TagSerializer::class)
@JsonDeserialize(using = TagDeserializer::class)
class Tag(
    val tag: String,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

)
