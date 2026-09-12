# Changelog

## Unreleased

### Fixed

- **H1 session map locators** — GitHub `fixtures/memnet-session.map` already keeps `qname` on PRT/POR/CON. Pi MUST restore that file; operator-narrow `SCHEMA PRT ; fields=id name kind role status recycle` is a **soft-pass**, not bind (strips locators on `session_save`/`load`). LIVE bind MUST use `--map-file`. SHA256 CI-pin is **not** this PR (Devicor). `proof_pass_claimed` stays **false**. Not a Foam proof pass.
