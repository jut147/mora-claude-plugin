# Mora AI typed MCP results

Mora AI's hosted MCP endpoint is:

```
https://app.mora-marketer.com/api/mcp
```

It uses Streamable HTTP and OAuth 2.1 with CIMD client identification and PKCE S256. It does not accept API keys or support Dynamic Client Registration.

## Contract guarantee

Every public read tool advertises an `outputSchema` in `tools/list`. On a successful `tools/call`, Mora validates the handler result before returning it as `structuredContent`; it also retains a JSON text block for clients that have not adopted structured results yet.

This means an integration can rely on the published contract rather than parsing prose or database-shaped payloads. A handler that drifts from its contract returns an MCP tool error instead of invalid structured data.

`get_post_performance` is the strongest example. Its result is provider-confirmed post evidence, ranked by total engagement, with the metric snapshot date and an explicit evidence boundary. It returns one of three states:

- `ranked`: provider-confirmed posts are available for the requested window.
- `empty_input`: no provider-confirmed metrics exist; this is not a zero-performance claim.
- `error`: Mora could not retrieve the evidence; do not treat it as an empty result.

The same owner-scoped provider-performance reader powers Mora's internal AI SDK tool and the public MCP tool. Internal workflows call that service directly; they never make an HTTP call back into Mora's public MCP endpoint.

## AI SDK typed consumption

Use `@ai-sdk/mcp` with an OAuth client provider appropriate for the host application. Define the output schema for the tools the application actually needs. The AI SDK then reads MCP `structuredContent`, validates it at runtime, and infers the result type.

```ts
import { createMCPClient } from '@ai-sdk/mcp';
import { z } from 'zod';

const rankedPost = z.object({
  id: z.string(),
  caption: z.string().nullable(),
  platforms: z.array(z.string()),
  published_at: z.string().nullable(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  saves: z.number(),
  clicks: z.number(),
  impressions: z.number(),
  engagement_count: z.number(),
  engagement_rate_percent: z.number().nullable(),
  metric_day: z.string(),
  metrics_fetched_at: z.string(),
  evidence_boundary: z.string(),
});

const postPerformance = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('ranked'),
    posts: z.array(rankedPost),
    timeframe_days: z.number(),
    total: z.number(),
    ranking_basis: z.literal('total_engagement'),
    metric_source: z.literal('provider_synced_post_metrics'),
  }),
  z.object({
    kind: z.literal('empty_input'),
    reason: z.literal('no_data'),
    message: z.string(),
    posts: z.array(rankedPost),
  }),
  z.object({
    kind: z.literal('error'),
    error: z.string(),
    message: z.string(),
    posts: z.array(rankedPost),
  }),
]);

const mcp = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://app.mora-marketer.com/api/mcp',
    authProvider: moraOAuthProvider,
  },
});

try {
  const tools = await mcp.tools({
    schemas: {
      get_post_performance: {
        inputSchema: z.object({
          timeframe_days: z.number().int().min(1).max(365).default(30),
          limit: z.number().int().min(1).max(50).default(10),
        }),
        outputSchema: postPerformance,
      },
    },
  });

  const performance = await tools.get_post_performance.execute(
    { timeframe_days: 30, limit: 10 },
    { messages: [], toolCallId: 'mora-performance-1' },
  );

  if (performance.kind === 'ranked') {
    // `performance.posts` is typed provider-confirmed evidence.
    // Ground recommendations in these metrics only.
  }
} finally {
  await mcp.close();
}
```

Never silently turn `empty_input` or `error` into a positive performance claim. Use `get_revenue_attribution` when the question is about real attributed revenue rather than engagement.

## Registry status

The official MCP Registry record is active at:

```
https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Mora-AI-Content-Studio%2Fmora/versions/latest
```

Namespace: `io.github.Mora-AI-Content-Studio/mora`.

Verification method: GitHub publisher authentication for the `Mora-AI-Content-Studio` organization. The current official registry version is `1.0.3`.

GitHub's VS Code registry endpoint (`https://api.mcp.github.com`) had no Mora listing at the time of this release and exposes no public self-service submission route. Do not describe it as a published listing until GitHub provides an onboarding path or the endpoint returns the Mora record.
