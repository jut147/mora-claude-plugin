# Changelog

Repository: https://github.com/Mora-AI-Content-Studio/mora-claude-plugin

## 0.6.0 — 2026-08-21

- Renamed public-facing plugin copy to Mora AI while preserving the stable `mora` identifier and the organization repository URL.
- Added the required `.codex-plugin/plugin.json` manifest for Codex and the shared plugin directory.
- Added a grounded, read-only `paid-ad-copy` workflow based on the public ten-tool MCP contract.
- Kept client compatibility claims aligned with `docs/mcp-contract.json`; the Codex CLI OAuth limitation remains documented.

## 0.5.1 — 2026-08-19

- Cut every marketplace-facing description down to a single punchy line ("Claude guesses your brand voice. Mora gives it the real one, plus your real catalogue and performance.") — the prior 0.5.0 wording fixed the Shopify-only narrowing but was still a full paragraph, which reads badly next to other listings on aggregator sites like claudemarketplaces.com. Replaced the README's buried single example with three short, concrete example prompts.

## 0.5.0 — 2026-08-19

- Fixed a real positioning bug, not just wording: every description (README, plugin.json, marketplace.json, the setup skill) called Mora "an AI content OS for Shopify/DTC brands," which excludes two of Mora's three co-primary consumer personas by weight. Mara (personal brand/thought leadership, LinkedIn, no catalogue) and Julien (full-time creator, IG/TikTok/YouTube, no catalogue) are 50% combined weight per `docs/planning/personas_Updated061326.md` and have no Shopify store at all. Shopify catalogue and revenue grounding is a real capability for stores that connect one, not the plugin's whole identity. Rewrote every description to lead with "creators and small teams" and treat Shopify grounding as additive.

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
