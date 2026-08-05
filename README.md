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

- **Mora's official remote MCP server**, pre-configured — no manual `.mcp.json` editing, no API key to
  paste. First use triggers Mora's own OAuth 2.1 consent screen in your browser.
- **Five read-only tools**: `list_posts`, `get_post_performance`, `get_brand_profile`, `list_products`,
  `list_projects`. No tool can publish, schedule, connect an account, or spend money — Mora treats writes
  through an unattended agent loop as unsafe to expose until per-scope consent exists in-app.
- **A brand-voice resource** (`mora://brand/voice`) you can attach once per session so every message Claude
  writes stays on-brand, without re-fetching it per message.
- **Three launch-workflow prompts**, most notably a full Product Hunt launch week that already knows
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
    factual brand + catalogue summary for work happening *outside* Mora — briefing a designer,
    writing ad copy, prepping a pitch. Triggers on "give me my Mora brand brief", "what does my
    brand sell", "summarize my Mora catalogue".
  - `skills/content-gap-check` — combines `list_projects` and `list_posts` to compare what's
    planned against what's actually gone out and surface overdue or orphaned content. Triggers
    on "check my Mora content calendar for gaps", "am I behind on my content schedule".

## Why read-only, and why five tools

Read-only is a considered position, not a placeholder. Every serious content-quality failure Mora has
shipped and documented — a fabricated brand wordmark reaching a draft, unrequested posts silently added to
an account — happened _with a human reviewing the loop_. Handing write access to a loop without one isn't
something Mora can honestly call safe yet.

Five tools is a measured ceiling, not an economy move: published research on tool-selection accuracy shows
smaller models' tool-choice accuracy degrading past roughly 10–15 tools in a single context, and Mora's own
design principle is that a longer tool list is not automatically better for an agent holding it. These five
answer the five questions a marketing agent actually asks; nothing here overlaps.

## Requirements

- An existing or new Mora account (free to create at https://www.mora-marketer.com).
- Claude Code with plugin support and remote MCP + OAuth support enabled.

## Getting started

Ask Claude something like _"connect to my Mora account"_ or _"what should I post this week based on what's
worked for my brand"_ — the bundled skill picks up from there and walks through the one-time OAuth consent.

## Support

- Product: https://www.mora-marketer.com
- MCP server documentation: https://app.mora-marketer.com/developers/mcp
- Issues with this plugin: open an issue on this repository.

## License

MIT — see `LICENSE`.
