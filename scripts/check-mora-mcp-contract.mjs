#!/usr/bin/env node

import { readFile } from 'node:fs/promises'

const endpoint = 'https://app.mora-marketer.com/api/mcp'
const serverCardUrl = process.env.MORA_MCP_SERVER_CARD_URL || 'https://app.mora-marketer.com/.well-known/mcp/server-card.json'
const expectedTools = [
  'list_posts',
  'get_post_performance',
  'get_brand_profile',
  'list_products',
  'get_revenue_attribution',
  'list_projects',
  'list_audiences',
  'list_content_angles',
  'list_brief_runs',
]
const expectedResource = 'mora://brand/voice'
const expectedPrompts = ['product_hunt_launch_week', 'first_maker_comment', 'write_like_what_worked']
const repositoryUrl = 'https://github.com/jut147/mora-claude-plugin'

const readText = async (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const failures = []
const pass = (label) => console.log(`PASS ${label}`)
const fail = (label, detail) => failures.push(`${label}: ${detail}`)

let card
try {
  const raw = process.env.MORA_MCP_SERVER_CARD_FILE
    ? await readFile(process.env.MORA_MCP_SERVER_CARD_FILE, 'utf8')
    : await (async () => {
        const response = await fetch(serverCardUrl, { signal: AbortSignal.timeout(15_000) })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.text()
      })()
  card = JSON.parse(raw)
} catch (error) {
  fail('server card fetch/parse', error instanceof Error ? error.message : String(error))
}

if (card) {
  const actualTools = card.capabilities?.tools?.map(({ name }) => name)
  const actualResources = card.capabilities?.resources?.map(({ uri }) => uri)
  const actualPrompts = card.capabilities?.prompts?.map(({ name }) => name)

  if (card.transport?.url === endpoint) pass('canonical remote MCP endpoint')
  else fail('canonical remote MCP endpoint', `expected ${endpoint}, got ${card.transport?.url}`)

  if (JSON.stringify(actualTools) === JSON.stringify(expectedTools)) pass('nine-tool inventory')
  else fail('nine-tool inventory', `expected ${expectedTools.join(', ')}, got ${actualTools?.join(', ')}`)

  if (JSON.stringify(actualResources) === JSON.stringify([expectedResource])) pass('brand-voice resource')
  else fail('brand-voice resource', `expected ${expectedResource}, got ${actualResources?.join(', ')}`)

  if (JSON.stringify(actualPrompts) === JSON.stringify(expectedPrompts)) pass('three prompt inventory')
  else fail('three prompt inventory', `expected ${expectedPrompts.join(', ')}, got ${actualPrompts?.join(', ')}`)

  if (card._scope?.readOnly === true) pass('read-only scope declaration')
  else fail('read-only scope declaration', 'server card does not declare _scope.readOnly=true')

  if (card.links?.some(({ rel, href }) => rel === 'repository' && href === repositoryUrl)) pass('public repository link')
  else fail('public repository link', `server card does not link ${repositoryUrl}`)
}

for (const [label, path] of [
  ['README', 'README.md'],
  ['Mora setup skill', 'skills/mora-mcp-setup/SKILL.md'],
]) {
  const content = await readText(path)
  for (const tool of expectedTools) {
    if (!content.includes(`\`${tool}\``)) fail(`${label} tool ${tool}`, 'tool name is missing')
  }
  for (const prompt of expectedPrompts) {
    if (!content.includes(`\`${prompt}\``)) fail(`${label} prompt ${prompt}`, 'prompt name is missing')
  }
  if (!content.includes(expectedResource)) fail(`${label} resource`, `missing ${expectedResource}`)
  if (!content.includes(endpoint)) fail(`${label} endpoint`, `missing ${endpoint}`)
  if (!content.includes(repositoryUrl)) fail(`${label} repository`, `missing ${repositoryUrl}`)
  if (/\b(six|Six)\b/.test(content)) fail(`${label} stale count`, 'contains a six-tool reference')
  else pass(`${label} is synchronized to the current contract`)
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`)
  process.exitCode = 1
} else {
  console.log(`Mora MCP contract check passed against ${serverCardUrl}`)
}
