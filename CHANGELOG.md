# Changelog

## Unreleased

### Fixed

- **H1 session map locators** — GitHub `fixtures/memnet-session.map` keeps `qname` on PRT/POR/CON. CI-pin SHA256 `c2f16136e6f09f9a6c1ddf0026a15676f731575f1d2a1da6ccc2c464aa727bc3`. Pi MUST restore that file; operator-narrow SCHEMA is a **soft-pass**, not bind. `proof_pass_claimed` stays **false**. Not a Foam proof pass.
