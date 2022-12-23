package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Tags;
import org.akashihi.mdg.service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TagController {
    private final TransactionService transactionService;

    @GetMapping(value = "/tags", produces = "application/vnd.mdg+json;version=1")
    public Tags list() {
        return new Tags(transactionService.listTags());
    }
}
