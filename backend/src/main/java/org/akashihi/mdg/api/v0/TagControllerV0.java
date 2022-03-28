package org.akashihi.mdg.api.v0;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.TagData;
import org.akashihi.mdg.service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TagControllerV0 {
    private final TransactionService transactionService;

    @GetMapping(value = "/api/tag", produces = "application/vnd.mdg+json")
    DataPlural<TagData> list() {
        var tags = transactionService.listTags().stream().map(t -> new TagData(t.getId(), "tag", new TagData.Attributes(t.getTag()))).toList();
        return new DataPlural<>(tags);
    }
}
