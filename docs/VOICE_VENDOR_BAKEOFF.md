# Voice vendor bake-off (not production)

Candidates: NLPearl, Retell, Synthflow.

Hard requirements before any production use:
- Signed BAA, SOC 2 Type II, US data residency
- Documented sub-processors including models in the call path
- Option to disable recording and training
- Configurable AI disclosure, human transfer, event logs

v1 ships `StubVoiceProvider` only. `placeCall` always returns accepted=false.

Do not wire production calling until counsel approves vendor and scripts.

Scored scenarios to run later: voicemail, gatekeeper, hold, wrong department, hostile recipient, request for PHI, identity verification, language switch, silence, dropped call.
