# Agents QA report (automated subset)

| Area | Status |
|---|---|
| Redaction identifiers | Unit tests tokenize SSN, email, phone, MRN-like values |
| Extraction/rules | Deterministic unit tests for NSCLC and generic fallback |
| Empathy and language | Agent copy corpus scanned for mortality, banned phrases, dashes |
| Prompt injection | Neutralization plus no `place_voice_call` in pipeline output |
| Access estimator | Haversine SF to LA within 300 to 400 miles |
| Program matching | Unverified seed set, no funds promised, 911 blocked |
| Voice | Stub never places a call |
| Permissions helper | Owner-only row access |
| Flags | Default off |
| Full Section 9 clinician sets of 200 | Not yet. Block GA. |
| WCAG/Lighthouse 90 | Not re-run in this pass |
| Voice 50 scenarios | Blocked on vendor |
