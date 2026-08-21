---
name: brand-brief
description: This skill should be used when the user asks to "give me my Mora brand brief", "what does my brand sell", "summarize my Mora catalogue", "pull my brand info from Mora", or needs their real brand facts on hand for work happening outside Mora — briefing a designer, writing ad copy, prepping a pitch.
---

# Brand Brief

Produce a portable, factual summary of a user's real business — pulled from their own Mora
account, not written from a guess — for use in work that happens outside Mora entirely. The
brief itself is the deliverable here, not a step toward writing new social content.

## When to use this

Trigger when the user wants their brand facts summarized or handed off for use elsewhere:
briefing a designer or freelancer, prepping a pitch or investor update, writing ad copy on a
platform Mora doesn't touch, or any variant of "what does my brand actually sell / sound like."
This is distinct from the content-performance-audit skill (which is about what has performed)
and from ordinary content drafting inside Mora (which should call `get_brand_profile` itself as
a grounding step, not go through this skill).

## Procedure

1. Call `get_brand_profile` — business name, what it sells, who it sells to, and its voice.
2. Call `list_products` (no `search` filter, default limit) to pull the current catalogue.
3. Assemble a single brief with these sections, using only what the tools returned:
   - **Business** — name, one-line description of what it sells, from `get_brand_profile`.
   - **Audience** — who it sells to, verbatim from what the tool returned, not elaborated.
   - **Voice** — the brand voice as described, quoted or closely paraphrased, not reinvented.
   - **Catalogue** — a compact list of products from `list_products`: title, price
     (`min_price`), and a short line from `description` if present. If the user asked about a
     specific product or category, call `list_products` again with a `search` substring instead
     of filtering a full list by eye.
4. Keep the brief tight and copy-pasteable — this is meant to be dropped into an email, a doc,
   or a prompt for other work, not read as a report. Do not pad it with commentary or marketing
   language of your own; the value is that every fact in it is real.

## Honest emptiness

If `get_brand_profile` returns thin or missing fields, say plainly which facts are not on
record in Mora — do not invent a name, description, audience, or voice to fill a gap. A missing
brand profile means brand setup hasn't been completed in Mora, not that the business has no
identity; say that directly and suggest completing it in Mora rather than guessing on the user's
behalf.

If `list_products` returns zero products, its own response says an empty list means no
catalogue is connected, not that the business sells nothing — carry that distinction into the
brief verbatim. Never name a specific product that didn't come back from the tool, even if the
business name makes a product obvious to guess. If the user needs product facts and the
catalogue is empty, say so and ask them directly rather than filling the section with a
plausible-sounding placeholder.
