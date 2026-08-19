# Changelog

Repository: https://github.com/Mora-AI-Content-Studio/mora-claude-plugin

## 0.4.0 — 2026-08-19

- Synchronized with the live 10-tool contract: added `get_brief_workspace` to the README, setup skill, architecture doc, and checked-in contract summary.
- Replaced the vague "client-dependent" compatibility table with a verified matrix: the real gate for any client is CIMD vs. Dynamic Client Registration (DCR) support, not tool/resource/prompt rendering. This server issues CIMD `client_id`s only and has no `/register` endpoint. Live-tested 2026-08-19: Codex CLI 0.147.0 fails immediately on `Dynamic client registration not supported`. VS Code and Cursor are documented as unverified/likely-fails rather than implied to work.
- Added a request/auth-flow sequence diagram and a repo-relationship diagram to `docs/mcp-architecture.md`.
- Fixed `scripts/check-mora-mcp-contract.mjs`'s own hardcoded repository/architecture URL constants, which still pointed at the pre-transfer `jut147/mora-claude-plugin` path after 0.3.1.

## 0.3.1 — 2026-08-19

- Repository moved from `jut147/mora-claude-plugin` to `Mora-AI-Content-Studio/mora-claude-plugin`. No functional change; GitHub redirects the old path automatically.

## 0.3.0 — 2026-08-11

- Synchronized the public connector with Mora's hosted nine-tool read-only MCP contract.
- Added contract, architecture, security, contribution, and compatibility documentation.
- Added live drift checks for primitive inventory, repository linkage, and transport method behavior.

## Versioning policy

- The plugin version describes this public connector repository.
- The server-card version describes the hosted MCP service contract and is owned by the Mora app.
- The MCP protocol revision is negotiated by the hosted runtime and is not the plugin version.
- A hosted deployment timestamp is operational metadata, not a connector release.

Read the live server card before relying on a capability. A connector release does not itself deploy or change
the hosted MCP runtime.
