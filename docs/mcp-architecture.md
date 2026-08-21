# Mora AI MCP architecture and contract

This repository is Mora AI's public connector and workflow package. It is not the Mora MCP runtime.
The runtime is hosted by Mora at:

```text
https://app.mora-marketer.com/api/mcp
```

Repository: https://github.com/Mora-AI-Content-Studio/mora-claude-plugin

## Where this fits in Mora's repos

There is deliberately no separate "docs" repository. Mora's public developer documentation
(`/developers/mcp`, `llms.txt`, `llms-full.txt`, `auth.md`) is published from the same site that serves the
product, not a standalone docs deploy — one canonical source instead of a second copy that can drift, which
is also what the contract check below exists to prevent.

```mermaid
flowchart LR
    subgraph "Mora-AI-Content-Studio (GitHub org)"
        plugin["mora-claude-plugin\n(public — this repo)\nconnector config + agent skills"]
        site["mora-marketer-site\n(private)\nmarketing site + public /developers/mcp docs"]
        app["Mora app\n(private)\nMCP runtime, OAuth server, tool handlers"]
    end
    client["MCP host\n(Claude Code supported; see matrix)"] -->|installs| plugin
    plugin -->|points at| endpoint["app.mora-marketer.com/api/mcp"]
    endpoint --> app
    site -->|publishes human docs for| endpoint
    site -->|links to| plugin
```

The app repo is private by design — it holds real account data, OAuth secrets, and the tool handlers
themselves. This connector repo is public because it contains nothing but configuration and prose: no
runtime code, no credentials, nothing that would be sensitive to publish. That split (public thin connector,
private runtime) is why this repo can be public at all.

## What the connection does

The connection lets an authorized AI client read the signed-in account's own marketing context before
drafting content: brand profile, products, posts, recorded performance, projects, audiences, content angles,
brief research, and revenue attribution. It is designed to reduce confident guesses about a business.

It does not publish, schedule, connect accounts, change billing, write the brand kit, or expose the licensed
third-party Discover corpus. Every currently exposed tool is read-only and the only issuable scope is
`mora.read`.

## Ownership and request flow

```mermaid
sequenceDiagram
    participant C as MCP client (Claude Code, ...)
    participant R as Protected-resource metadata
    participant A as Mora authorization server
    participant U as User (browser consent)
    participant M as Mora MCP runtime

    C->>R: GET /.well-known/oauth-protected-resource
    R-->>C: authorization server location
    C->>A: authorization_code request<br/>client_id = CIMD https:// URL, PKCE S256
    A->>A: fetch + validate client's CIMD document<br/>(no /register endpoint — DCR is not supported)
    A->>U: consent screen (mora.read scope, read-only)
    U-->>A: approve
    A-->>C: opaque OAuth bearer token
    C->>M: POST JSON-RPC /api/mcp (Bearer token on every request)
    M->>M: resolve account owner -> read-only tool/resource/prompt handlers
    M-->>C: result, scoped to the consenting account
```

A client that cannot present a CIMD `client_id` (i.e. one that only implements Dynamic Client Registration)
fails at the second step, before any tool, resource, or prompt is ever negotiated — see
[Authentication and client compatibility](../README.md#authentication-and-client-compatibility) in the
README for which clients this has actually been verified against.

The client discovers the flow from:

- Protected resource metadata: `https://app.mora-marketer.com/.well-known/oauth-protected-resource`
- Authorization server metadata: `https://app.mora-marketer.com/.well-known/oauth-authorization-server`
- Server card: `https://app.mora-marketer.com/.well-known/mcp/server-card.json`

This repository contributes connector configuration and workflow skills. It never contains private handler
code, database access, credentials, or a replacement OAuth server.

## MCP primitives

Tools are selected by the model. The current ten tools are:

`list_posts`, `get_post_performance`, `get_brand_profile`, `get_brief_workspace`, `list_products`,
`get_revenue_attribution`, `list_projects`, `list_audiences`, `list_content_angles`, and `list_brief_runs`.

The resource `mora://brand/voice` is attached by the user when they want brand voice to remain in context for
the conversation. The prompts `product_hunt_launch_week`, `first_maker_comment`, and
`write_like_what_worked` are named user-invoked workflows, not hidden autonomous actions.

Clients should inspect negotiated capabilities. A client may support tools without supporting resources or
prompts; the connector does not assume every host renders every primitive identically.

## Data and behavior boundaries

- Results are scoped to the account that granted consent.
- Empty catalogue, post, performance, audience, angle, or brief data is returned with explanatory context;
  clients must not invent the missing business facts.
- List results use bounded limits and may include a truncation note directing the client to narrow the query.
- `GET /api/mcp` and `DELETE /api/mcp` return `405` with `Allow: POST, OPTIONS` because this deployment is
  stateless and does not expose a GET stream or session teardown. `OPTIONS` is the CORS preflight.
- The public connector is separate from browser WebMCP. Browser WebMCP is a signed-in, consent-gated app
  capability and is not this HTTP endpoint or its OAuth discovery mechanism.

## Verified client compatibility — evidence

The README states the headline table; this is the evidence behind it, kept here rather than in the
top-level README because it's implementation detail, not something a first-time reader needs.

| Client            | Status                        | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code       | Supported                     | This repository is its connector; exercised on every use.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Claude Desktop    | Expected, unverified          | Ships Anthropic's CIMD-capable SDK. No independent live test performed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Codex CLI 0.147.0 | Not yet supported             | Live-tested 2026-08-19: `codex mcp add mora-test --url https://app.mora-marketer.com/api/mcp` followed by its automatic OAuth login failed immediately with `Registration failed: Dynamic client registration not supported`, before any browser/consent step. Codex attempts DCR first; this server has no `/register` endpoint. Codex's `codex mcp login --oauth-client-id <url>` flag might allow pointing it at a real CIMD document instead — untested, and would need Codex to treat that value as CIMD rather than a pre-registered static id. |
| Cursor            | Not yet supported             | Not independently live-tested (Cursor isn't installed on the machine this was verified from). Cursor has an open community feature request specifically asking for CIMD support (forum: "MCP OAuth: CIMD Support Plans and Timelines"), with no shipped-support changelog entry found as of 2026-08-19 — i.e. this is Cursor's own tracked gap, not speculation.                                                                                                                                                                                      |
| VS Code           | Not yet supported, unverified | No public evidence of CIMD support found as of 2026-08-19. Not independently live-tested.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

Re-verify before changing any status in the README table — do not upgrade a row from evidence alone getting
older; re-test or find a dated changelog entry from the client vendor.

## Contract source of truth

The live server card is authoritative for primitive names and availability. The checked-in summary is
[`docs/mcp-contract.json`](./mcp-contract.json). Run:

```bash
node scripts/check-mora-mcp-contract.mjs
```

The check compares the summary and public documentation with the live card and verifies the transport
method behavior. It does not claim input/output JSON Schemas that the public server card does not expose.
