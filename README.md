# Mora for Claude Code

Connect Claude Code to [Mora](https://www.mora-marketer.com), an AI content OS for Shopify and DTC brands,
so Claude can see what your business actually is, what has actually worked, and what's actually in your
catalogue before it writes anything for you.

## What is Mora

Mora is a **tiered** AI content engine — solo creators and Shopify/DTC operators today, multi-location
franchises and governed enterprise templates as the product matures. It plans, drafts, gets human approval
on, schedules and publishes social content, and closes the loop with real engagement and (for Shopify
merchants) revenue attribution. The biggest thing Mora does that a generic content tool doesn't: it grounds
every draft in a real Shopify catalogue and a real order history, not just a brand-voice guess.

**Who this plugin is for:** a Claude Code user who already has (or wants) a Mora account and wants to pull
their own brand context, past performance, and product catalogue into a Claude Code session — for example,
to plan a Product Hunt launch, draft a week of posts, or check what already worked before writing more.

## What this plugin gives you

- **Mora's official remote MCP server connector**, pre-configured — no manual `.mcp.json` editing, no API key to
  paste. First use triggers Mora's own OAuth 2.1 consent screen in your browser. The hosted MCP runtime and
  account-scoped handlers live in Mora's product app; this public repository contains only connector configuration
  and workflow skills.
- **Ten read-only tools**: `list_posts`, `get_post_performance`, `get_brand_profile`, `get_brief_workspace`,
  `list_products`, `get_revenue_attribution`, `list_projects`, `list_audiences`, `list_content_angles`, and
  `list_brief_runs`. No tool can publish, schedule, connect an account, or spend
  money — Mora treats writes through an unattended agent loop as unsafe to expose until per-scope consent
  exists in-app.
- **A brand-voice resource** (`mora://brand/voice`) you can attach once per session so every message Claude
  writes stays on-brand, without re-fetching it per message.
- **Three launch-workflow prompts** — `product_hunt_launch_week`, `first_maker_comment`, and
  `write_like_what_worked` — most notably a full Product Hunt launch week that already knows
  Product Hunt's current rules (no vote solicitation, no "Coming Soon" pages — retired August 2025) so you
  don't have to.
- **Four skills** that package the tools above into actual workflows instead of leaving you to
  chain tool calls yourself:
  - `skills/mora-mcp-setup` — first connection, what each tool and prompt is for. Triggers when
    you ask about connecting to or using Mora.
  - `skills/content-performance-audit` — combines `list_posts` and `get_post_performance` into a
    synthesized brief on what's actually working (platform, theme, timing) and what to do next.
    Triggers on "how is my content performing", "audit my Mora posts", "what's working on my
    social".
  - `skills/brand-brief` — combines `get_brand_profile` and `list_products` into a portable,
    factual brand + catalogue summary for work happening _outside_ Mora — briefing a designer,
    writing ad copy, prepping a pitch. Triggers on "give me my Mora brand brief", "what does my
    brand sell", "summarize my Mora catalogue".
  - `skills/content-gap-check` — combines `list_projects` and `list_posts` to compare what's
    planned against what's actually gone out and surface overdue or orphaned content. Triggers
    on "check my Mora content calendar for gaps", "am I behind on my content schedule".

## Why read-only, and why so few tools

Read-only is a considered position, not a placeholder. Every serious content-quality failure Mora has
shipped and documented — a fabricated brand wordmark reaching a draft, unrequested posts silently added to
an account — happened _with a human reviewing the loop_. Handing write access to a loop without one isn't
something Mora can honestly call safe yet.

A small tool count is a measured ceiling, not an economy move: published research on tool-selection accuracy
shows smaller models' tool-choice accuracy degrading past roughly 10–15 tools in a single context, and Mora's
own design principle is that a longer tool list is not automatically better for an agent holding it. These
nine answer the questions a marketing agent actually asks — including "what real revenue does a channel
actually deserve credit for", "which audience is this for", and "which content angles or brief findings already
exist" — and nothing here overlaps.

## Requirements

- An existing or new Mora account (free to create at https://www.mora-marketer.com).
- Claude Code with plugin support and remote MCP + OAuth support enabled.

## Contract and runtime ownership

The canonical remote MCP endpoint is `https://app.mora-marketer.com/api/mcp`. The live server card at
`https://app.mora-marketer.com/.well-known/mcp/server-card.json` is the source of truth for the tool,
resource, prompt, and read-only metadata. This public repository is the Claude Code connector and workflow
package; it is not the private MCP runtime. Repository: https://github.com/Mora-AI-Content-Studio/mora-claude-plugin.

Run the production contract check before publishing documentation changes:

```bash
node scripts/check-mora-mcp-contract.mjs
```

For an offline fixture, set `MORA_MCP_SERVER_CARD_FILE=/path/to/server-card.json`.

Developer documentation:

- [Architecture and data flow](docs/mcp-architecture.md)
- [Machine-readable contract summary](docs/mcp-contract.json)
- [Security policy](SECURITY.md)
- [Contribution guide](CONTRIBUTING.md)
- [Changelog and version policy](CHANGELOG.md)

## Authentication and client compatibility

Every request needs an OAuth-issued bearer token. Mora's server identifies clients with **CIMD (Client ID
Metadata Documents)** — the MCP spec's current recommended standard (2026-07-28), which formally deprecates
the older **Dynamic Client Registration (DCR)** flow. Claude's own SDKs and Claude Code already ship CIMD;
most other MCP clients are still catching up to the new spec, since it's a recent change.

| Client                     | Support                                                                                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code                | Supported — this repository is its connector.                                                                                                                                                                                                                        |
| Claude Desktop             | Expected to work (Anthropic's SDK ships CIMD); not yet independently verified.                                                                                                                                                                                       |
| Codex CLI, Cursor, VS Code | Not yet — these clients' OAuth flow currently expects DCR, which this spec-forward server doesn't implement. Tracking upstream support; see [`docs/mcp-contract.json`](docs/mcp-contract.json)'s `clientCompatibility` field for verification dates and test detail. |

This is an authentication-protocol gap, not a missing feature on Mora's side — CIMD is where the ecosystem is
heading, not a workaround. [`docs/mcp-architecture.md`](docs/mcp-architecture.md) has the full auth-flow
diagram and the live test evidence behind the table above.

This isn't a rendering gap other clients will "just work around" — until a client ships CIMD support (or
Mora separately stands up a DCR-compatible path, which is not currently planned), the honest answer for an
unverified/failing client is "not yet," not "add the URL and see." Machine-readable form of this table:
[`docs/mcp-contract.json`](docs/mcp-contract.json)'s `clientCompatibility` field. See
[`docs/mcp-architecture.md`](docs/mcp-architecture.md) for the full request/auth flow diagram.

## Getting started

Ask Claude something like _"connect to my Mora account"_ or _"what should I post this week based on what's
worked for my brand"_ — the bundled skill picks up from there and walks through the one-time OAuth consent.

## Support

- Product: https://www.mora-marketer.com
- MCP server documentation: https://app.mora-marketer.com/developers/mcp
- Canonical server card: https://app.mora-marketer.com/.well-known/mcp/server-card.json
- Agent authentication guide: https://www.mora-marketer.com/auth.md
- Public repository role: this repository is the Claude Code connector; the hosted MCP endpoint is the runtime.
- Issues with this plugin: open an issue on this repository.

## License

MIT — see `LICENSE`.
