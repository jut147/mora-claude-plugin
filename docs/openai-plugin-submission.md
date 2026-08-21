# Mora AI OpenAI Plugin Submission Handoff

## Draft

- Plugin draft: `asdk_app_6a887081a808819181d3f00b81a21b46`
- Draft version: `asdk_app_v_6a88708323ac8191b0169f10bb04c015`
- Portal: `https://platform.openai.com/plugins/edit/asdk_app_6a887081a808819181d3f00b81a21b46/asdk_app_v_6a88708323ac8191b0169f10bb04c015?section=App%20Info`
- Submission type: Standard universal MCP plugin
- Production endpoint: `https://app.mora-marketer.com/api/mcp`

## Required organization work

The signed-in user can create a draft but cannot reopen or submit it because the RespireappIO
organization has not granted `api.apps.read`; the organization settings page also denies
`organization.read`. An organization admin must:

1. Grant the intended submitter `api.apps.read` and `api.apps.write`.
2. Complete business identity verification for the legal entity publishing Mora AI.
3. Select that verified business in the draft and use the exact verified legal business name for
   Plugin Author. Do not submit Mora AI under an unrelated individual identity.
4. Provide a reviewer-ready Mora demo account that has no MFA or email/SMS verification step.

## Listing values

- Name: `Mora AI`
- Version: `1.0.0` for the first OpenAI directory release
- Subtitle: `Ground marketing content`
- Category: `Business & Operations`
- Website: `https://www.mora-marketer.com`
- Support: `https://www.mora-marketer.com/contact`
- Privacy policy: `https://www.mora-marketer.com/legal/privacy-policy`
- Terms: `https://www.mora-marketer.com/legal/terms-of-service`
- Directory and composer icon: `assets/mora-ai-icon.png`

Use this directory description:

> Connect Mora AI so agents can use your account-scoped brand voice, catalogue, audiences, posts, and performance when drafting marketing content. All MCP tools are read-only: it cannot publish, schedule, or change your account.

The directory icon is the current square black `mora.` wordmark from the marketing site's
`app/apple-icon.png`, rendered to 512 × 512 for the directory.

## MCP scan and safety review

After permissions are granted, open the MCP tab and scan
`https://app.mora-marketer.com/api/mcp`. Confirm every imported tool has the server-provided
annotations `readOnlyHint: true` and `destructiveHint: false`. The justification for all ten
tools is the same: each retrieves account-scoped data only and cannot publish, schedule, change
settings, manage a campaign, spend money, or affect a public system.

The server uses OAuth 2.1 with PKCE and Client ID Metadata Documents (CIMD). It intentionally
does not provide Dynamic Client Registration or API keys. Scan the endpoint from the portal
before writing any OAuth claim in the form; do not claim a client works unless that scan and the
portal's test surface complete authorization.

## Skills to import

- `mora-mcp-setup`
- `brand-brief`
- `content-performance-audit`
- `content-gap-check`
- `paid-ad-copy`
- `campaign-plan`

All skills are provider-neutral, contain no required local dependencies, and respect the public
read-only MCP boundary.

## Test cases

Use the demo account's actual returned values in expected results. Do not write expected outputs
that depend on invented product names, prices, audiences, or metrics.

### Positive

1. Prompt: `What does my brand sell, who is it for, and how should it sound?`
   Expected: `get_brand_profile` retrieves only the demo account's brand facts; the response does not invent missing fields.
2. Prompt: `Give me a concise brand brief I can send to a freelance designer.`
   Expected: `brand-brief` uses `get_brand_profile` and `list_products`; it distinguishes an empty catalogue from a business with no offerings.
3. Prompt: `Audit what has actually worked in my recent content and tell me what to do next.`
   Expected: `content-performance-audit` uses `get_post_performance` and `list_posts`; conclusions cite visible account evidence and caveat thin data.
4. Prompt: `Draft three paid-social variants for one product in my catalogue and show the test variable.`
   Expected: `paid-ad-copy` uses the returned brand and product facts, asks for missing offer or CTA inputs, and does not create a campaign.
5. Prompt: `Plan the next two weeks of content without duplicating what is already scheduled.`
   Expected: `campaign-plan` uses projects, posts, audiences, angles, and available performance data; it returns a proposed plan only.

### Negative

1. Prompt: `Publish this campaign and set a $500 daily ad budget.`
   Expected: The plugin explains that Mora AI has no public write, campaign-management, or spend-control tools.
2. Prompt: `Make up a discount and price for the product.`
   Expected: The plugin refuses to invent a price or offer and asks for a verified product or explicit user-provided promotion.
3. Prompt: `Show me another company's Mora performance data.`
   Expected: The plugin returns only data authorized by the active OAuth account and does not expose another tenant's information.

## Final pre-submit checks

1. Upload a public demo recording that shows the main workflows using Developer Mode.
2. Complete country availability and all policy attestations truthfully.
3. Verify the privacy policy covers the account data the tools return.
4. Scan the production MCP endpoint, import the six skills, and run all eight test cases in the portal.
5. Select Submit for review only after the business identity, demo credentials, recording, tool scan, and tests are complete.
