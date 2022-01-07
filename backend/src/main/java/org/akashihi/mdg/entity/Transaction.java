package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;

@Getter
@Setter
@ToString
@Entity
@Table(name = "tx")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comment;
    @JsonProperty("timestamp")
    private LocalDateTime ts;
    @ManyToMany
    @JoinTable(name="tx_tags", joinColumns = @JoinColumn(name = "tx_id"), inverseJoinColumns = @JoinColumn(name="tag_id"))
    @ToString.Exclude
    private Collection<Tag> tags;
    @OneToMany(mappedBy = "transaction")
    @ToString.Exclude
    private Collection<Operation> operations;
}
