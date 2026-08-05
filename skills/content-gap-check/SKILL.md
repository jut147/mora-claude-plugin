---
name: content-gap-check
description: This skill should be used when the user asks "what's planned vs what's actually gone out", "check my Mora content calendar for gaps", "am I behind on my content schedule", "what's overdue in Mora", or wants to know whether their content plan is actually being executed. Combines Mora's `list_projects` and `list_posts` tools to compare planned slots against real post history and surface gaps.
version: 0.1.0
---

# Content Gap Check

Compare what a Mora account has *planned* against what has actually been *posted*, and surface
the difference. This is a distinct question from performance (content-performance-audit) or
brand facts (brand-brief): it's about execution against a plan, not quality or identity.

## Scope

This is a question about execution against a plan, not about quality or identity. Route
performance questions ("what's working") to content-performance-audit and brand questions
("what do we sell") to brand-brief instead of this skill.

## Procedure

1. Call `list_projects` to get this account's content projects, each with its `slots` (from
   `project_tasks`: `topic`, `cta`, `platform`, `scheduled_at`, `status`).
2. Call `list_posts` (no status filter, or a generous limit) to get the account's actual posts
   across all statuses.
3. Compare, per project:
   - **Overdue** — a slot with `scheduled_at` in the past whose `status` is not a terminal
     completed state, and with no obviously matching post in `list_posts` (match loosely on
     platform + rough timing + topic language; do not claim a definitive 1:1 match the data
     can't support — say "likely matches" or "no clear match" rather than asserting certainty).
   - **On track** — slots with a scheduled date still ahead, or a status indicating completion.
   - **Orphan posts** — published or scheduled posts in `list_posts` that don't correspond to
     any planned slot. This is not necessarily a problem (spontaneous posts are normal) but is
     worth naming if the user is asking specifically about plan adherence.
4. Report gaps plainly, grouped by project: what's overdue, what's on track, and what's
   unaccounted for. Do not soften an overdue slot into "on track" language, and do not treat a
   slot's mere existence as proof it was executed — only `list_posts` evidence counts as
   execution.

## Honest emptiness

If `list_projects` returns zero projects, say this account has no content projects in Mora —
that's a statement about planning, not about the business having no content strategy. If
`list_posts` returns zero posts while projects exist, say the plan has no matching execution
yet rather than guessing at reasons. Never infer that a gap was intentional (e.g. "they must
have decided to skip this") — report the gap and let the user explain it.
