# Contributing

Contributions to this repository must stay within the public connector and workflow boundary. Do not add
private Mora runtime code, database queries, credentials, API keys, or claims that are not present in the
live server card or public documentation.

Repository: https://github.com/jut147/mora-claude-plugin

## Documentation changes

1. Check the live server card and OAuth metadata.
2. Update `README.md`, the relevant skill, `docs/mcp-architecture.md`, and `docs/mcp-contract.json` together
   when the public contract changes.
   Keep the current safety boundary (`mora.read`, read-only, account-scoped) explicit when changing auth or
   capability documentation.
3. Run the no-dependency contract check:

   ```bash
   node scripts/check-mora-mcp-contract.mjs
   ```

4. Explain client compatibility claims with a tested client and date. Do not imply that every MCP host
   supports prompts or resources just because the server advertises them.

## Pull requests

Describe whether the change affects connector installation, workflow behavior, or only documentation. Include
the live contract-check result. Never include access tokens, customer payloads, or unredacted OAuth URLs with
authorization codes.
