# Mora AI OpenAI demo recording plan

## Demo goal

Show Mora AI as a grounded marketing operator: it reads the connected account's real brand and marketing context, turns that context into useful drafts and plans, and stays inside a clearly read-only MCP boundary.

The reviewer should leave with four answers:

1. Mora uses account facts instead of inventing a brand, product, audience, or performance story.
2. Mora turns those facts into practical marketing work: briefs, performance reviews, plans, and ad drafts.
3. The workflows are useful in the product UI, not only as raw MCP calls.
4. The submitted MCP server cannot publish, schedule, change prices, manage campaigns, or spend money.

## Recording setup

- Use a dedicated Mora demo account and demo workspace with sample data only.
- Do not use a production account, real customer data, real revenue data, or a real OAuth session.
- The demo account must work with an ordinary login and password, without MFA, email confirmation, SMS confirmation, or private-network access. Pre-provisioning and verifying that account is acceptable; do not add an authentication bypass, a privileged backdoor, or a blanket MFA exemption to the product.
- Record in ChatGPT Developer Mode with the Mora app selected.
- Use screen capture with a short voiceover; a face camera is not needed for this workflow.
- Hide browser bookmarks, personal tabs, OAuth callback URLs, tokens, email addresses, account IDs, and private customer details.
- Record the web experience first. If the app is not available on iOS or Android, do not imply that it is; state that the demonstrated surface is web Developer Mode.
- Keep the recording focused and reviewable: approximately 6–9 minutes.

## Walkthrough sequence

### 1. Opening: the problem and the boundary — 20 seconds

Show the Mora app selected in ChatGPT Developer Mode.

Say:

> Mora helps a marketer plan and draft from the account's actual brand, catalogue, audiences, content history, and performance. This demo uses a read-only connection: it can ground and recommend work, but it cannot publish, schedule, change prices, manage campaigns, or spend money.

Why this is shown: it establishes the product promise and the safety boundary before any data appears.

### 2. Ground a brand brief — 60–90 seconds

Prompt:

> What does my brand sell, who is it for, and how should it sound? Give me a concise brief I can send to a freelance designer.

Expected workflow:

- `get_brand_profile`
- `list_products`

Show the response using the demo account's real product and brand facts. Point out that an empty catalogue is reported as empty rather than filled with invented products.

Pain addressed: generic AI often guesses the product, audience, or voice.

Value shown: a usable brief grounded in the account's own source of truth.

### 3. Explain what has worked — 60–90 seconds

Prompt:

> Audit what has actually worked in my recent content and tell me what to do next.

Expected workflow:

- `get_post_performance`
- `list_posts`

Show the evidence behind the recommendations. Call out the difference between visible account evidence and a confident-sounding guess, especially if the demo account has thin data.

Pain addressed: marketers cannot reliably remember which topics, platforms, or posts performed best.

Value shown: recommendations tied to actual posts and metrics.

### 4. Plan around existing work — 75–90 seconds

Prompt:

> Plan the next two weeks of content without duplicating what is already scheduled.

Expected workflow:

- `list_projects`
- `list_posts`
- `list_audiences`
- `list_content_angles`

Show the proposed plan and explicitly say it is a proposal. Do not click any publish, schedule, or delivery action during the submission demo.

Pain addressed: new plans often duplicate scheduled work or ignore the audience and angle already chosen.

Value shown: a coherent next step that respects the account's existing calendar and strategy.

### 5. Draft paid-social variants without inventing an offer — 75–90 seconds

Prompt:

> Draft three paid-social variants for one product in my catalogue, use my recent performance data to inform the angle, and show the test variable.

Expected workflow:

- `get_brand_profile`
- `list_products`
- `list_audiences`
- `list_content_angles`
- `get_post_performance`

Use a demo account with a real product, audience, angle, and recent post. Supply the platform, offer, and CTA in the prompt or as follow-up context. If the offer is missing, the correct behavior is to ask for it rather than invent a price or discount.

Pain addressed: ad drafts become risky when the model fabricates a product claim, price, or promotion.

Value shown: several testable creative options with a clear variable and a human-review step.

### 6. Inspect a brief run and its blockers — 60–75 seconds

Prompt:

> Find my latest brief run, show the current state of its brief workspace, and explain what is blocking the next step.

Expected workflow:

- `list_brief_runs`
- `get_brief_workspace`

Show the bounded or redacted workspace state and explain the blocker in plain language. Do not reveal internal IDs or secrets in the recording.

Pain addressed: research-heavy briefs become opaque when the team cannot see what is complete, blocked, or still needs evidence.

Value shown: a traceable handoff from research state to next action.

### 7. Quick product tour — 45–60 seconds

Use the Mora UI navigation without exposing private records:

- Insights: performance and account evidence.
- Discover: research and content opportunities.
- Publishing: calendar, posts, feed, and delivery views.
- Campaigns: paid-channel performance and returned value.
- Briefs: audience- and concept-driven batches of work.
- Studio: image and video creation from prompts, products, saved looks, or references.
- Workflows: saved end-to-end runs that ask for what they need and execute the work.

Why this is shown: it proves the MCP-backed app is part of a broader product workflow, while keeping the submission story centered on the read-only capabilities actually being reviewed.

### 8. Negative safety case — 30 seconds

Prompt:

> Change the live price of this product to $49 and publish a 20% promotion.

Expected behavior: Mora explains that it has no public tool for changing prices, promotions, or campaigns and does not attempt the action.

Why this is shown: it demonstrates that the read-only annotations match the real boundary and that the app does not overclaim.

## Closing narration

> Mora turns account evidence into marketing work while keeping the final decision with the human. The connected server is account-scoped and read-only: it grounds the work, but it does not publish, schedule, change prices, or spend money.

## What the recording is for

The recording is a submission-review artifact attached to the Platform draft. It is not the product itself and it is not a substitute for testing the MCP endpoint. The published-plugin documentation does not state that this URL becomes a public directory asset; it is supplied for review. Still, use an unlisted, reviewer-reachable URL and assume anyone who receives it can watch it. Do not include secrets, customer data, credentials, or personal information.

## Before recording

- Verify the developer identity is the exact verified person or corporation used in the listing.
- Add the dedicated demo credentials to the Testing tab.
- Confirm all six skills show `Passed`.
- Confirm the three starter prompts are saved.
- Confirm the MCP scan and domain verification remain successful.
- Confirm the privacy policy covers the account data returned by the tools.
- Keep policy attestations unchecked until the publisher has reviewed and accepted them.
- After recording, upload the video to a reviewer-accessible URL and paste only that URL into Demo Recording URL.
