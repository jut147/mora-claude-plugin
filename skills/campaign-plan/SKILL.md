---
name: campaign-plan
description: This skill should be used when the user asks for a content campaign, launch plan, marketing plan, editorial calendar, or a plan for what to create next grounded in their Mora AI account data.
---

# Campaign Plan

Create a campaign plan from the user's real Mora AI context. This skill creates a proposed plan in the
conversation; it does not create projects, schedule posts, publish content, set ad budgets, or change any
account state.

## When to use this

Use for a launch plan, content calendar, campaign direction, or a request to decide what to create next.
Do not use it for a single piece of copy, a performance audit, or checking whether an existing plan was
executed. Route those requests to `paid-ad-copy`, `content-performance-audit`, or `content-gap-check`.

## Procedure

1. Call `get_brand_profile` first. Use it as the factual baseline for the business, voice, audience, and
   offerings.
2. Call `list_projects` and `list_posts` to understand commitments already planned, drafted, scheduled,
   and published. Do not propose a calendar that silently duplicates active work.
3. Call `list_audiences` and `list_content_angles` to choose a target audience and a small set of grounded
   messages. If those results are thin, identify the missing context instead of inventing personas or pain
   language.
4. Call `get_post_performance` when there is published-history data. Use it to prioritize proven themes or
   formats, but do not claim it establishes causation.
5. Call `list_products` only when the campaign needs catalogue facts. Use returned product names, prices,
   and descriptions exactly; an empty result means no connected catalogue context is available.
6. Ask for the campaign objective, time horizon, primary platform, offer, and CTA when they are not
   supplied. State any assumptions that remain after the question.
7. Produce a plan with a specific objective, audience, angle sequence, content inventory, cadence, CTA
   logic, evidence used, and open decisions. Separate recommended organic posts from paid-ad variants; the
   public connection can draft copy but cannot create or manage campaigns.

## Quality bar

- Every recommendation must trace to account data, a user-provided goal, or a clearly labeled assumption.
- Do not use a scheduled post as evidence that it was published or performed.
- Do not invent a product, offer, price, audience, metric, landing page, or platform capability.
- Keep the plan useful to a human operator: a concise table or ordered sequence is better than generic
  campaign language.
