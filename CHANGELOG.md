# Changelog

Repository: https://github.com/Mora-AI-Content-Studio/mora-claude-plugin

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
