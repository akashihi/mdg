# MDG API specification

`openapi.yaml` is an OpenAPI 3.1.0 description of the MDG REST API, and it is the
**only** specification of that API. It replaces `docs/mdg.apib`, which was removed
when this was written.

It is **hand-authored and hand-maintained.** Nothing in the build derives it from
the code and nothing verifies it against the code — there is no springdoc, no
springfox, no codegen. If you change a controller, change this document in the
same commit. See `MIGRATION-NOTES.md` for what happens when that slips: it is the
list of drifts the previous specification had accumulated.

## Layout

```
openapi.yaml                  root document — info, servers, tags, and all 39 paths
components/
  parameters.yaml             reusable query and path parameters
  responses.yaml              shared error responses, plus the reused success ones
  schemas/
    common.yaml               shared scalar types (amounts, timestamps)
    problem.yaml              the error body and its code enum
    account.yaml budget.yaml category.yaml currency.yaml
    rate.yaml report.yaml setting.yaml tag.yaml transaction.yaml
.spectral.yaml                lint ruleset, also used by CI
```

### Why the paths are not in their own files

They were, briefly. **OpenAPI 3.1 removed `$ref` from the Path Item Object**, so a
root document that writes

```yaml
paths:
  /accounts:
    $ref: './paths/accounts.yaml#/accounts'
```

is valid 3.0 and invalid 3.1. Redocly tolerates it; Spectral and other strict
validators reject it, one error per path. Splitting the paths out would therefore
mean either dropping to 3.0 or bundling the document before anything could
validate it. Neither was worth it, so the paths live inline and only `components/`
is split — `$ref` to a Schema, Parameter or Response object is perfectly legal in
3.1, and those are the parts that are actually reused.

The practical consequence is the good one: `openapi.yaml` is a standalone-valid
3.1 document. Point any tool straight at it, with no bundling step.

## Working with it



`redocly lint` also works and reports no content errors, but it does flag two of
its default policy rules that this API does not satisfy and is not going to:

- `security-defined` — MDG has no authentication at the API layer at all. Access
  control is whatever fronts the deployment.
- `operation-4xx-response` — nine collection and status endpoints genuinely have
  no 4xx to document. They take no parameters and no body (`GET /accounts`,
  `/accounts/tree`, `/categories`, `/currencies`, `/tags`, `/settings`,
  `/rates/status`, `/reports/totals`, `/reports/evaluation`), so there is nothing
  about the request that can be wrong and their only failure mode is a 500.

## Conventions used here

- Every request and response uses `application/vnd.mdg+json;version=1`, errors
  included. The only exceptions are the `204 No Content` responses.
- `readOnly: true` marks fields the server computes and ignores on write — mostly
  Hibernate `@Formula` columns such as account balances.
- Fields annotated `@JsonInclude(NON_NULL)` in the entities are documented as
  **optional**, not nullable: they are absent from the JSON, not `null`. Fields
  without that annotation and with a nullable type are documented as nullable.
  The distinction matters — the frontend's JTD schemas reject unknown members.
- Behaviour that is surprising but real is written into the operation
  `description` rather than silently smoothed over, and known defects are called
  out as such. Where a description says something is a defect, the spec documents
  the buggy behaviour, because that is what a client will receive today.
