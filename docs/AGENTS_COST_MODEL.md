# Agents cost model (planning)

| Meter | Planning assumption |
|---|---|
| CtP extraction | Prefer deterministic extract. Optional Haiku call if evals require it. Cache by document hash. |
| Rewording | Only approved rule text. Sonnet or cheaper if evals pass. |
| Maps | Haversine fallback is free. Maps API is optional and must be listed as a subprocessor. |
| Voice | Pass through vendor cost per minute. Meter on Advocate and Professional. |

Alert when a user exceeds a configurable token or call-minute cap. Quotas belong in `agent_runs.cost_tokens` and `cost_cents`.
