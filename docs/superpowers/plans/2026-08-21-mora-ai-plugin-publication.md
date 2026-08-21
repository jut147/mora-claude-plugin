# Mora AI Plugin and MCP Publication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package Mora AI as a client-neutral public plugin, keep the hosted read-only MCP contract honest, and publish the corrected remote-server metadata.

**Architecture:** The public GitHub repository is a thin connector and workflow package. The hosted Mora app remains the source of truth for the MCP runtime, OAuth behavior, tool handlers, and server card. The plugin manifest packages the existing MCP connection and grounded skills for local testing and public directory review without claiming that the current Codex CLI OAuth flow works.

**Tech Stack:** JSON manifests, Markdown skills, Streamable HTTP MCP, OAuth 2.1 with PKCE and CIMD, `mcp-publisher`, OpenAI Plugin submission portal.

**Spec:** `docs/mcp-contract.json` and `docs/mcp-architecture.md`

## Global Constraints

- Repository source: `https://github.com/Mora-AI-Content-Studio/mora-claude-plugin`.
- Hosted endpoint: `https://app.mora-marketer.com/api/mcp`.
- Public MCP access is read-only, account-scoped, OAuth-only, and has no API keys or Dynamic Client Registration.
- `clientCompatibility` in `docs/mcp-contract.json` is the only source of truth for client status.
- The official MCP Registry entry describes the hosted endpoint, not connector code.
- `Mora AI` is the customer-facing display name; `mora` is the stable identifier.

### Task 1: Package the cross-client connector

**Files:**
- Create: `.codex-plugin/plugin.json`
- Modify: `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`
- Modify: `README.md`
- Modify: `skills/mora-mcp-setup/SKILL.md`

- [x] Add the required Codex manifest with `skills: "./skills/"` and an inline `mcpServers` object; preserve Claude's existing bare-map `.mcp.json` format.
- [x] Use `Mora AI` for display and descriptions while retaining `mora` as the identifier.
- [x] Document Claude Code installation separately from Codex packaging and preserve the exact compatibility matrix.

### Task 2: Add the missing grounded workflow

**Files:**
- Create: `skills/paid-ad-copy/SKILL.md`

- [x] Add a read-only paid-ad-copy workflow that uses brand profile, products, audiences, angles, posts, and performance only when relevant.
- [x] Explicitly prohibit campaign creation, budgets, publication, invented claims, and unsupported product facts.

### Task 3: Reconcile public documentation links

**Files:**
- Modify: `docs/mcp-architecture.md`
- Modify: `/Users/jt/Developer/project/mora-marketer-site/app/(marketing)/developers/mcp/page.tsx`

- [x] Identify the GitHub organization repository as the public connector and the hosted app as the runtime.
- [x] Link the canonical server card, OAuth metadata, human MCP docs, and organization repository.
- [x] Describe Codex packaging without upgrading the documented Codex CLI status.

### Task 4: Publish remote metadata

**Files:**
- Modify: `server.json`
- Modify: `CHANGELOG.md`

- [x] Set the official registry description to the approved Mora AI copy and bump the registry metadata version.
- [x] Validate with `mcp-publisher validate server.json`.
- [x] Publish with the verified GitHub namespace `io.github.Mora-AI-Content-Studio/mora`.
- [x] Verify the latest record through `/v0.1/servers/{serverName}/versions/latest`.

### Task 5: Check downstream directories and OpenAI submission

**Files:**
- No repository file changes.

- [x] Check `https://api.mcp.github.com/v0/servers` for ingestion after the official registry publication.
- [ ] Confirm whether an OpenAI plugin draft exists in the authenticated Platform organization; repository state alone cannot prove portal submission.
- [ ] Submit only after business identity verification, public MCP access, reviewer credentials if required, tool annotations, and the required positive/negative test cases are ready.
