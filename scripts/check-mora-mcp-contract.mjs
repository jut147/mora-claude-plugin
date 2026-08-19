#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const endpoint = "https://app.mora-marketer.com/api/mcp";
const serverCardUrl =
  process.env.MORA_MCP_SERVER_CARD_URL ||
  "https://app.mora-marketer.com/.well-known/mcp/server-card.json";
const expectedTools = [
  "list_posts",
  "get_post_performance",
  "get_brand_profile",
  "get_brief_workspace",
  "list_products",
  "get_revenue_attribution",
  "list_projects",
  "list_audiences",
  "list_content_angles",
  "list_brief_runs",
];
const expectedResource = "mora://brand/voice";
const expectedPrompts = [
  "product_hunt_launch_week",
  "first_maker_comment",
  "write_like_what_worked",
];
const repositoryUrl =
  "https://github.com/Mora-AI-Content-Studio/mora-claude-plugin";
const contractPath = "docs/mcp-contract.json";
const architectureUrl =
  "https://github.com/Mora-AI-Content-Studio/mora-claude-plugin/blob/master/docs/mcp-architecture.md";
const protectedResourceUrl =
  "https://app.mora-marketer.com/.well-known/oauth-protected-resource";
const authorizationServerUrl =
  "https://app.mora-marketer.com/.well-known/oauth-authorization-server";

const readText = async (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");
const currentVersion = JSON.parse(
  await readText(".claude-plugin/plugin.json"),
).version;
const failures = [];
const pass = (label) => console.log(`PASS ${label}`);
const fail = (label, detail) => failures.push(`${label}: ${detail}`);

let card;
try {
  const raw = process.env.MORA_MCP_SERVER_CARD_FILE
    ? await readFile(process.env.MORA_MCP_SERVER_CARD_FILE, "utf8")
    : await (async () => {
        const response = await fetch(serverCardUrl, {
          signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })();
  card = JSON.parse(raw);
} catch (error) {
  fail(
    "server card fetch/parse",
    error instanceof Error ? error.message : String(error),
  );
}

if (card) {
  const actualTools = card.capabilities?.tools?.map(({ name }) => name);
  const actualResources = card.capabilities?.resources?.map(({ uri }) => uri);
  const actualPrompts = card.capabilities?.prompts?.map(({ name }) => name);

  if (card.transport?.url === endpoint) pass("canonical remote MCP endpoint");
  else
    fail(
      "canonical remote MCP endpoint",
      `expected ${endpoint}, got ${card.transport?.url}`,
    );

  if (JSON.stringify(actualTools) === JSON.stringify(expectedTools))
    pass("ten-tool inventory");
  else
    fail(
      "ten-tool inventory",
      `expected ${expectedTools.join(", ")}, got ${actualTools?.join(", ")}`,
    );

  if (JSON.stringify(actualResources) === JSON.stringify([expectedResource]))
    pass("brand-voice resource");
  else
    fail(
      "brand-voice resource",
      `expected ${expectedResource}, got ${actualResources?.join(", ")}`,
    );

  if (JSON.stringify(actualPrompts) === JSON.stringify(expectedPrompts))
    pass("three prompt inventory");
  else
    fail(
      "three prompt inventory",
      `expected ${expectedPrompts.join(", ")}, got ${actualPrompts?.join(", ")}`,
    );

  if (card._scope?.readOnly === true) pass("read-only scope declaration");
  else
    fail(
      "read-only scope declaration",
      "server card does not declare _scope.readOnly=true",
    );

  if (
    card.links?.some(
      ({ rel, href }) => rel === "repository" && href === repositoryUrl,
    )
  )
    pass("public repository link");
  else
    fail(
      "public repository link",
      `server card does not link ${repositoryUrl}`,
    );
}

try {
  const contract = JSON.parse(await readText(contractPath));
  const contractTools = contract.tools;
  const contractResources = contract.resources;
  const contractPrompts = contract.prompts;

  if (contract.endpoint === endpoint) pass("contract endpoint");
  else
    fail("contract endpoint", `expected ${endpoint}, got ${contract.endpoint}`);
  if (JSON.stringify(contractTools) === JSON.stringify(expectedTools))
    pass("contract ten-tool inventory");
  else
    fail(
      "contract ten-tool inventory",
      "checked-in contract differs from expected tools",
    );
  if (JSON.stringify(contractResources) === JSON.stringify([expectedResource]))
    pass("contract resource");
  else
    fail(
      "contract resource",
      "checked-in contract differs from expected resource",
    );
  if (JSON.stringify(contractPrompts) === JSON.stringify(expectedPrompts))
    pass("contract prompts");
  else
    fail(
      "contract prompts",
      "checked-in contract differs from expected prompts",
    );
  if (
    contract.authorization?.protectedResourceMetadata === protectedResourceUrl
  )
    pass("contract protected-resource metadata");
  else
    fail(
      "contract protected-resource metadata",
      `missing ${protectedResourceUrl}`,
    );
  if (
    contract.authorization?.authorizationServerMetadata ===
    authorizationServerUrl
  )
    pass("contract authorization-server metadata");
  else
    fail(
      "contract authorization-server metadata",
      `missing ${authorizationServerUrl}`,
    );
  if (
    contract.scope?.readOnly === true &&
    contract.scope?.accountScoped === true
  )
    pass("contract safety scope");
  else
    fail(
      "contract safety scope",
      "contract must declare read-only account-scoped access",
    );
} catch (error) {
  fail(
    "checked-in contract fetch/parse",
    error instanceof Error ? error.message : String(error),
  );
}

try {
  for (const method of ["GET", "DELETE"]) {
    const response = await fetch(endpoint, {
      method,
      signal: AbortSignal.timeout(15_000),
    });
    if (
      response.status === 405 &&
      (response.headers.get("allow") || "").includes("POST")
    )
      pass(`${method} transport boundary`);
    else
      fail(
        `${method} transport boundary`,
        `expected 405 with Allow containing POST, got ${response.status} / ${response.headers.get("allow")}`,
      );
  }
  const options = await fetch(endpoint, {
    method: "OPTIONS",
    signal: AbortSignal.timeout(15_000),
  });
  if (options.status === 204) pass("OPTIONS transport boundary");
  else
    fail("OPTIONS transport boundary", `expected 204, got ${options.status}`);
} catch (error) {
  fail(
    "transport boundary fetch",
    error instanceof Error ? error.message : String(error),
  );
}

for (const [label, path] of [
  ["README", "README.md"],
  ["Mora setup skill", "skills/mora-mcp-setup/SKILL.md"],
  ["Architecture", "docs/mcp-architecture.md"],
]) {
  const content = await readText(path);
  for (const tool of expectedTools) {
    if (!content.includes(`\`${tool}\``))
      fail(`${label} tool ${tool}`, "tool name is missing");
  }
  for (const prompt of expectedPrompts) {
    if (!content.includes(`\`${prompt}\``))
      fail(`${label} prompt ${prompt}`, "prompt name is missing");
  }
  if (!content.includes(expectedResource))
    fail(`${label} resource`, `missing ${expectedResource}`);
  if (!content.includes(endpoint))
    fail(`${label} endpoint`, `missing ${endpoint}`);
  if (!content.includes(repositoryUrl))
    fail(`${label} repository`, `missing ${repositoryUrl}`);
  if (label === "README" && !content.includes("docs/mcp-architecture.md"))
    fail(`${label} architecture link`, `missing ${architectureUrl}`);
  if (
    label === "Architecture" &&
    (!content.includes(protectedResourceUrl) ||
      !content.includes(authorizationServerUrl))
  )
    fail(`${label} discovery links`, "missing OAuth discovery links");
  if (/\b(five|Five|six|Six|nine|Nine)\s+(tools|total)\b/.test(content))
    fail(`${label} stale count`, "contains a five/six-tool reference");
  else pass(`${label} is synchronized to the current contract`);
}

for (const [label, path] of [
  ["Security policy", "SECURITY.md"],
  ["Contribution guide", "CONTRIBUTING.md"],
  ["Changelog", "CHANGELOG.md"],
]) {
  const content = await readText(path);
  if (!content.includes(repositoryUrl))
    fail(`${label} repository`, `missing ${repositoryUrl}`);
  if (label !== "Changelog" && !content.includes("mora.read"))
    fail(`${label} scope`, "missing mora.read safety boundary");
  if (label === "Changelog" && !content.includes(currentVersion))
    fail(
      `${label} version`,
      `missing current connector version ${currentVersion} (from plugin.json)`,
    );
  if (/\b(five|Five|six|Six|nine|Nine)\s+(tools|total)\b/.test(content))
    fail(`${label} stale count`, "contains a stale tool-count reference");
  else pass(`${label} is present`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Mora MCP contract check passed against ${serverCardUrl}`);
}
