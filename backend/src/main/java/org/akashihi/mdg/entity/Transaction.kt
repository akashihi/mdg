package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "tx")
@NoArgsConstructor
@AllArgsConstructor
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
    private Set<Tag> tags;
    @OneToMany(mappedBy = "transaction")
    @ToString.Exclude
    @OrderBy("id")
    private Collection<Operation> operations;
}
