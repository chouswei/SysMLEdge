# Changelog

## Unreleased

### Fixed

- **H1 session map locators** — `fixtures/memnet-session.map` SCHEMA for PKG/PRT/POR/CON keeps `qname` (and `path` / `sysml_kind`). CI-pin SHA256 `c2f16136e6f09f9a6c1ddf0026a15676f731575f1d2a1da6ccc2c464aa727bc3` (`fixtures/memnet-session.map.sha256` + test). A Pi operator overwrite of narrow `SCHEMA PRT ; fields=id name kind role status recycle` dropped qname on `session_save` / `session_load` (soft-pass, not bind). LIVE bind MUST restore the GitHub map and open with `--map-file`. `proof_pass_claimed` stays **false**. Not a Foam proof pass.
