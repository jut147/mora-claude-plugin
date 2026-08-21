---
name: paid-ad-copy
description: This skill should be used when the user asks for ad copy, paid social copy, search-ad copy, campaign creative copy, or a paid-ad brief grounded in their Mora AI brand, catalogue, audience, and real content performance.
---

# Paid Ad Copy

Create a grounded paid-ad copy brief from the user's real Mora AI account data. This skill
writes copy and planning material in the conversation; it does not create campaigns, set
budgets, publish ads, or call an advertising platform.

## When to use this

Use when the user asks for ad copy, paid social copy, search-ad copy, a creative angle,
or a paid-ad brief. Use the public MCP data to replace guessed product names, audiences,
voice, and performance claims with the account's own evidence.

Do not use this skill for publishing or campaign-management requests. The public Mora MCP
connection is read-only and exposes no ad-account mutation tools.

## Procedure

1. Call `get_brand_profile` first. Treat its business description, audience, voice, and
   offerings as the factual baseline.
2. If the request names a product, call `list_products` with a narrow search. Otherwise call
   `list_products` without a search only when catalogue context is needed. If the result is
   empty, say that no connected catalogue facts are available and do not invent a product.
3. Call `list_audiences` when the user has not supplied a target audience or asks for audience
   angles. Use the returned pain language as evidence, not as permission to exaggerate.
4. Call `list_content_angles` when the user asks for hooks or concepts. Call
   `get_post_performance` when the user asks what has worked or wants performance-informed
   variants. Call `list_posts` only when recent copy or status context is needed.
5. Ask for any missing brief inputs that materially change the copy: platform, objective,
   format, offer, destination, CTA, character limits, and required claims. Do not silently
   choose a conversion goal or invent a landing page.
6. Write the requested variants using only returned brand, catalogue, audience, and performance
   facts. Label any user-supplied assumptions separately. Never manufacture testimonials,
   discounts, guarantees, outcomes, prices, or performance claims.

## Output shape

- **Brief** — platform, objective, audience, offer, CTA, and constraints.
- **Evidence used** — the Mora AI facts and performance signals that shaped the copy.
- **Copy variants** — platform-appropriate options with character counts when relevant.
- **Test matrix** — the single variable changed between variants and the expected learning.
- **Open inputs** — facts the user must confirm before publishing.

Keep the output concise and ready to hand to a human campaign operator. If the evidence is
thin, say so plainly; thin account data is not a reason to fill gaps with generic certainty.
