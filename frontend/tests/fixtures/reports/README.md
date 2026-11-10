# Report fixtures

Raw response bodies of the `/reports/*` operations, captured once from a running backend
with `curl -s -o` (no `jq`, no reformatting). `Reports.test.ts` parses them with the strict
schemas, so they must stay byte-for-byte what the backend sent. `evaluation.headers` holds
the response headers of the evaluation capture; its `ETag` (quotes included) is used by the
ETag tests.

## Seed

Stack reset with `docs/openapi/reset.sql`, then, over the API (`Content-Type` and `Accept`
`application/vnd.mdg+json;version=1`), mirroring `api-test/data/templates/`:

1. `POST /categories` `{"account_type":"EXPENSE","name":"Housing","priority":1}`, then a child
   `{"account_type":"EXPENSE","name":"Utilities","priority":1,"parent_id":<Housing id>}`
2. `POST /accounts`: EUR asset `Wallet` (`Account.Asset.V1`), USD asset `Wallet USD`
   (`Account.Asset.USD.V1`), income `Salary` (`Account.Income.V1`), EUR expense `Rent` with
   `category_id` = Utilities.
3. `POST /transactions`: `Transaction.Rent.V1` (2017-02-04) and `Transaction.MultiCurrency.V1`
   (2017-02-05, rate 0.5), account ids substituted.
4. `POST /budgets` `Budget.Feb.V1` (id 20170204).
5. `PUT /budgets/20170204/entries/<Rent entry id>` `{"distribution":"EVEN","expected_amount":200}`
6. `PUT /settings/mnt.reporting.refresh` `{}`

## Requests (`GET`, `Accept: application/vnd.mdg+json;version=1`)

With `D = startDate=2017-02-01&endDate=2017-02-28&granularity=7`:

| File                      | Request                                                                       |
|---------------------------|-------------------------------------------------------------------------------|
| `totals.json`             | `/reports/totals`                                                             |
| `evaluation.json`         | `/reports/evaluation` (all zeros: 2017 is outside its window)                 |
| `assets-simple.json`      | `/reports/assets/simple?D`                                                    |
| `assets-currency.json`    | `/reports/assets/currency?D`                                                  |
| `assets-type.json`        | `/reports/assets/type?D`                                                      |
| `income-events.json`      | `/reports/income/events?D`                                                    |
| `expense-events.json`     | `/reports/expense/events?D`                                                   |
| `income-accounts.json`    | `/reports/income/accounts?D`                                                  |
| `expense-accounts.json`   | `/reports/expense/accounts?D`                                                 |
| `budget-execution.json`   | `/reports/budget/execution?startDate=2017-02-01&endDate=2017-03-31`           |
| `budget-cashflow.json`    | `/reports/budget/cashflow/20170204`                                           |
| `problem.json`            | `/reports/assets/simple?startDate=2017-02-01&endDate=2017-02-28&granularity=-1` (HTTP 400) |

`Amount.date` is never emitted by the backend yet, so no fixture carries it; the tests add it
in code.
