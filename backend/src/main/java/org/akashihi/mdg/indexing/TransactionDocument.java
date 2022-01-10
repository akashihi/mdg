package org.akashihi.mdg.indexing;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.akashihi.mdg.entity.Tag;
import org.akashihi.mdg.entity.Transaction;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.stream.Collectors;

@Document(indexName = "mdg")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class TransactionDocument {
    @Id
    private Long id;

    @Field(name = "comment", type = FieldType.Text, analyzer = "comments")
    private String comment;

    @Field(name = "tags", type = FieldType.Text, analyzer = "tags")
    private String tags;

    public TransactionDocument(Transaction tx) {
        this.id = tx.getId();
        this.tags = tx.getTags().stream().map(Tag::getTag).collect(Collectors.joining(" "));
        this.comment = tx.getComment();
    }
}
