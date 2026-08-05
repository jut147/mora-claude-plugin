---
name: mora-mcp-setup
description: This skill should be used when the user wants to connect Claude Code to their Mora account, asks "how do I use the Mora plugin", asks what Mora's MCP server can do, or wants Claude to read their brand voice, past posts, performance data, or Shopify catalogue from Mora before writing content. Also use when the user wants to plan a Product Hunt launch grounded in their real brand and past performance.
version: 0.1.0
---

# Connecting Claude Code to Mora

Mora (https://www.mora-marketer.com) is an AI content OS for Shopify/DTC brands: it plans, drafts,
approves and schedules social content, and tracks what actually performed. This plugin bundles Mora's
official remote MCP server so Claude can read a user's own Mora account — never anyone else's — before
writing anything for them.

This is a **read-only** connection. Nothing here publishes, schedules, or changes account settings. That
is a deliberate design position on Mora's side (see "What this can't do" below), not a plugin limitation.

## First-time connection

1. The plugin's `.mcp.json` already points Claude Code at `https://app.mora-marketer.com/api/mcp`. If the
   server does not show as connected, run `/mcp` to see its status.
2. The first tool or resource call triggers Mora's OAuth flow in the user's default browser. They sign in
   to their existing Mora account (or create one) and approve a **read-only** consent screen at
   `app.mora-marketer.com/oauth/authorize`. Nothing needs to be pasted — no API key, no token.
3. Once approved, Claude Code holds a scoped access token for this connection and refreshes it
   automatically. If the user ever wants to revoke access, they do it from Mora directly (Settings →
   Connected apps once that surface ships — until then, tell them to contact support@mora-marketer.com to
   revoke).
4. If a user has no Mora account yet, say so plainly and point them to https://www.mora-marketer.com — do
   not attempt to sign them up through this flow.

## What this connection is for

Ground anything you write for this user's business in their **real** account data instead of guessing.
Call `get_brand_profile` (or attach the `mora://brand/voice` resource) before writing any copy for them —
Mora's own house rule, carried into this plugin because a model that skips this step writes fluent,
confident, off-brand copy about a business it does not actually know.

## Tools (read-only, five total)

| Tool                   | Use it to                                                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_posts`           | See what this account has already drafted, scheduled or published, so you don't repeat it.                                                                                         |
| `get_post_performance` | See which past posts actually got engagement, so new copy is grounded in what worked rather than a guess.                                                                          |
| `get_brand_profile`    | Learn what this business is, what it sells, who it sells to, and how it sounds. Call this first.                                                                                   |
| `list_products`        | Name a real product from this account's Shopify catalogue instead of inventing one. An empty result means no catalogue is connected — do not name a specific product in that case. |
| `list_projects`        | See what content is already planned before proposing more.                                                                                                                         |

There are deliberately no write tools — no publish, schedule, connect, or billing action is exposed.
Handing an unattended agent loop write access to a real business's social presence is not something Mora
can honestly grade as safe yet; every failure mode Mora has shipped (fabricated brand names, unrequested
drafts) happened even with a human reviewing every step.

## Resource: `mora://brand/voice`

Attach this once at the start of a working session and it stays in context for the whole conversation, so
every message you write is on-brand without having to re-call a tool each time. It is prose, not JSON, on
purpose — the point is that it reads like documentation a person would hand a new copywriter. It's usually
reachable through Claude Code's "add context" / `@` picker under the `mora` server — the exact invocation
string Claude Code assigns depends on how it namespaces plugin-bundled MCP servers, so if `@mora:...`
doesn't resolve, check `/mcp` for the server's exact name and use whatever `@` form it shows there.

## Prompts (named workflows)

These arrive already carrying the compliance rules Mora enforces in-app but that you would otherwise not
know. They surface in Claude Code as slash commands namespaced by plugin and server — run `/mcp` (or start
typing `/` and look for entries mentioning `mora`) to see the exact registered names on your Claude Code
version, since the namespacing scheme can change between versions:

- **`product_hunt_launch_week`** — a full week of launch content (before / launch day / after), plus the
  first maker comment written in full.
- **`first_maker_comment`** — just the single highest-leverage Product Hunt asset (present in 70% of
  Product of the Day/Week/Month winners, per Product Hunt's own published data).
- **`write_like_what_worked`** — pulls this account's actual best-performing posts and writes new ones
  against that pattern, explicitly, rather than from generic best practice.

Use these instead of writing Product Hunt copy from general knowledge: Product Hunt retired "Coming Soon"
pages in August 2025 and penalizes vote solicitation, and most launch advice still circulating gets both
wrong. The prompts carry the current rules so you don't have to know them.

## Honest emptiness — read this before improvising

If a tool or the resource comes back empty or thin (no products, no published-post metrics, no brand
voice rows), that means the data genuinely isn't in this account yet — not that the business has nothing
to say. Every tool states this explicitly in its own response. **Do not fill the gap with something
plausible.** Ask the user, or write from what you do have and say what's missing. Inventing a product
name, a claim, or a number for a real business is worse than an incomplete answer — this is Mora's own
first design law, carried into this plugin.

## Troubleshooting

- **"No server found" / tools missing**: run `/mcp` to check connection status; the plugin's `.mcp.json`
  should show `mora` as connected. If not, the OAuth flow may not have completed — try calling any Mora
  tool again to re-trigger it.
- **Empty everything**: the signed-in account may be new, or the user may have multiple Mora accounts and
  authenticated the wrong one. Ask which account they meant.
- **A tool call errors**: Mora's tools surface the underlying error message rather than a generic one — read
  it back to the user; it is usually actionable (e.g. an expired session needing re-auth).
