# Changelog

## Unreleased

### Fixed

- **H1 session map locators** — `fixtures/memnet-session.map` SCHEMA for PKG/PRT/POR/CON keeps `qname` (and `path` / `sysml_kind`). A Pi operator overwrite of narrow `SCHEMA PRT ; fields=id name kind role status recycle` dropped qname on `session_save` / `session_load`, so keep-id hydrate lost Path-B locators and `pin_map qname=` missed (Peak_L CueConflict). LIVE bind MUST open with `--map-file` this map (TcpMemNet already does), not leftover `--map PKG qname,path`. `assertSchemaMapFile` refuses the narrow shape. `proof_pass_claimed` stays **false**. Not a Foam proof pass.
