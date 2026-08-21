---
name: content-performance-audit
description: This skill should be used when the user asks "how is my content performing", "audit my Mora posts", "what's working on my social", "what should I post more of", or wants a read on their Mora account's actual content performance before planning new posts. Combines Mora's `list_posts` and `get_post_performance` tools into a single synthesized brief grounded in the account's real history.
---

# Content Performance Audit

Turn Mora's raw post history and engagement data into a short, actionable brief instead of a
data dump. A user asking "how is my content doing" wants a verdict and a next move, not two
JSON blobs pasted back at them.

## Scope

Ground any "what to post next" answer in this account's actual history rather than generic
social media advice — that is the whole point of this skill over just writing from best
practice.

## Procedure

1. Call `get_post_performance` first (default limit is fine unless the user asks for a longer
   history) to get this account's best-performing published posts ranked by summed engagement
   (likes + comments + shares + saves).
2. Call `list_posts` to see the fuller picture — drafts, scheduled, and recently published posts
   across all statuses. This surfaces volume and cadence that `get_post_performance` alone
   cannot, since it only returns published posts with metrics.
3. Cross-reference the two. Do not report them as two separate lists — synthesize:
   - **Platform pattern**: which platform(s) the top performers cluster on, and whether that
     matches where most volume (`list_posts`) is actually going. A platform getting the most
     posts but not the top performers is a signal worth naming.
   - **Content theme**: read the `content` field of the top performers for a shared subject,
     format, or hook — do not invent a theme that isn't visibly there.
   - **Timing/cadence**: use `published_at` / `scheduled_at` / `created_at` to note posting
     frequency and whether performance clusters around specific days or a specific run of posts.
   - **Status mix**: flag if a large share of `list_posts` is stuck in `draft` or `failed` —
     that is itself a finding, not just performance context.
4. Produce a short brief with this shape, not a longer one:
   - **What's working** — 2-4 bullets, each citing a specific post or pattern, never a vague
     generality like "engaging content performs well."
   - **What to do next** — 1-3 concrete, specific suggestions tied directly to the evidence
     above (e.g. "post more on the platform/format that's already outperforming," not generic
     social media advice).
   - **Caveats** — anything the data can't support yet (see below).

## Example

Weak brief (vague, not grounded in the actual data returned):
> Your content is performing well overall! Engaging posts with strong hooks tend to do best.
> Keep posting consistently and try more video content.

Strong brief (specific, cites the actual posts and numbers returned by the tools):
> **What's working**: Your top 3 posts by engagement are all Instagram Reels posted Tue/Thu,
> each mentioning a specific product by name — the next-best post (LinkedIn, no product
> mentioned) got roughly a third of the engagement. Of your 12 most recent posts in `list_posts`,
> 4 are still sitting in `draft`.
> **What to do next**: Keep the Tue/Thu Reels cadence and keep naming a specific product; ship
> the 4 stuck drafts or drop them — they're neither helping nor failing right now, just idle.
> **Caveats**: Only 3 published posts have recorded metrics, so this is an early signal, not a
> confirmed pattern.

## Honest emptiness

If `get_post_performance` returns zero posts (its own `note` field says so explicitly), do not
manufacture a performance narrative. Say plainly that this account has no published posts with
recorded metrics yet, and fall back to what `list_posts` shows (drafts/scheduled) if there is
anything to say about content volume or cadence. Never present a made-up "what's working" section
when the account has no performance history — an empty or thin result means the data isn't in
Mora yet, not that the account has nothing worth posting.

If the account has a handful of published posts but too few to call a real pattern, say so —
"early signal from N posts" is honest; presenting 2 data points as a confident trend is not.

## Ground rules carried from Mora itself

Never treat "the post went out" as success — a post with zero recorded engagement is a data
point, not a win to celebrate. Do not attribute performance to a cause the data doesn't show
(e.g. claiming a post did well "because of the CTA" unless comparing it against posts that
share everything else and differ only on that CTA). When in doubt, report what the numbers show
and let the user draw the causal conclusion, or ask a clarifying question instead of guessing.
