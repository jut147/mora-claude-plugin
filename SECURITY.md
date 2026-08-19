# Security policy

## Scope

This repository contains public connector configuration and workflow documentation. The hosted MCP runtime
and OAuth implementation are private Mora application code. Do not submit secrets, private runtime code,
database identifiers, or customer data here.

Repository: https://github.com/Mora-AI-Content-Studio/mora-claude-plugin

## Safe use

- Install from the public repository, but authenticate only through Mora's browser consent flow.
- Do not paste a Mora session token or OAuth token into source control, prompts, screenshots, issue reports,
  `.mcp.json`, or shared configuration.
- Mora uses OAuth 2.1 authorization code, public CIMD client identity, and PKCE S256. There is no public API-key
  program and no Dynamic Client Registration endpoint.
- The current scope is `mora.read`; the hosted tools are read-only and account-scoped.
- Treat tool output as private account data and do not forward it to another service without the account
  owner's direction.

## Reporting a vulnerability

For credential exposure, tenant-isolation, OAuth, or hosted-runtime issues, contact `security@mora-marketer.com`
with the affected endpoint, reproduction steps, timestamps, and redacted evidence. Do not open a public issue
for an active credential or a suspected cross-account data disclosure.

For connector-only bugs, open a GitHub issue after removing tokens and private account data.
