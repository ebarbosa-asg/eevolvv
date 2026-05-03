#!/usr/bin/env tsx
/**
 * Agent eval harness — runs golden test cases against the agent execution endpoint.
 *
 * Usage:
 *   npm run test:agents                        # run all against localhost
 *   npm run test:agents -- --url https://os.eevolvv.ai  # run against production
 *   npm run test:agents -- --id tc-001         # run single test case
 *
 * Requires a valid agentId + clientId to exist in your DB.
 * Set TEST_AGENT_ID and TEST_CLIENT_ID in .env.local
 */

import golden from './fixtures/golden.json'

const BASE_URL  = process.env.TEST_BASE_URL   ?? 'http://localhost:3004'
const AGENT_ID  = process.env.TEST_AGENT_ID   ?? ''
const CLIENT_ID = process.env.TEST_CLIENT_ID  ?? ''

const idFilter = process.argv.find(a => a.startsWith('--id='))?.split('=')[1]
  ?? (process.argv.indexOf('--id') > -1 ? process.argv[process.argv.indexOf('--id') + 1] : null)

const urlOverride = process.argv.find(a => a.startsWith('--url='))?.split('=')[1]
  ?? (process.argv.indexOf('--url') > -1 ? process.argv[process.argv.indexOf('--url') + 1] : null)

const targetUrl = urlOverride ?? BASE_URL

interface Fixture {
  id: string
  name: string
  client: { name: string; company: string; business_type: string; notes: string }
  tasks: { title: string; description: string; status: string; category: string }[]
  assertions: {
    min_length: number
    must_mention_any: string[]
    banned_words: string[]
    must_have_number: boolean
    max_latency_ms: number
  }
}

interface TestResult {
  id: string
  name: string
  passed: boolean
  latencyMs: number
  failures: string[]
  outputLength: number
}

function hasNumber(text: string): boolean {
  return /\d+/.test(text)
}

function assert(fixture: Fixture, output: string, latencyMs: number): string[] {
  const failures: string[] = []
  const a = fixture.assertions

  if (output.length < a.min_length)
    failures.push(`Output too short: ${output.length} chars (min ${a.min_length})`)

  const lc = output.toLowerCase()
  const mentioned = a.must_mention_any.some(w => lc.includes(w.toLowerCase()))
  if (!mentioned)
    failures.push(`Must mention at least one of: ${a.must_mention_any.join(', ')}`)

  for (const word of a.banned_words) {
    if (lc.includes(word.toLowerCase()))
      failures.push(`Banned word found: "${word}"`)
  }

  if (a.must_have_number && !hasNumber(output))
    failures.push('Output must contain at least one specific number')

  if (latencyMs > a.max_latency_ms)
    failures.push(`Too slow: ${latencyMs}ms (max ${a.max_latency_ms}ms)`)

  return failures
}

async function runTest(fixture: Fixture): Promise<TestResult> {
  if (!AGENT_ID || !CLIENT_ID) {
    return {
      id: fixture.id, name: fixture.name, passed: false, latencyMs: 0,
      failures: ['Set TEST_AGENT_ID and TEST_CLIENT_ID in .env.local'],
      outputLength: 0,
    }
  }

  const url = `${targetUrl}/api/os/clients/${CLIENT_ID}/agents/${AGENT_ID}/run`
  const start = Date.now()

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggeredBy: 'eval', _testContext: fixture.client }),
    })

    const latencyMs = Date.now() - start

    if (!res.ok) {
      return { id: fixture.id, name: fixture.name, passed: false, latencyMs,
        failures: [`HTTP ${res.status}: ${await res.text()}`], outputLength: 0 }
    }

    const data = await res.json() as { output?: string }
    const output = data.output ?? ''
    const failures = assert(fixture, output, latencyMs)

    return { id: fixture.id, name: fixture.name, passed: failures.length === 0,
      latencyMs, failures, outputLength: output.length }

  } catch (err) {
    return { id: fixture.id, name: fixture.name, passed: false,
      latencyMs: Date.now() - start,
      failures: [err instanceof Error ? err.message : 'Unknown error'],
      outputLength: 0 }
  }
}

const GREEN  = '\x1b[32m'
const RED    = '\x1b[31m'
const YELLOW = '\x1b[33m'
const DIM    = '\x1b[2m'
const RESET  = '\x1b[0m'
const BOLD   = '\x1b[1m'

async function main() {
  const fixtures = (golden as Fixture[]).filter(f => !idFilter || f.id === idFilter)

  if (fixtures.length === 0) {
    console.error(`${RED}No fixtures found${idFilter ? ` matching id "${idFilter}"` : ''}${RESET}`)
    process.exit(1)
  }

  console.log(`\n${BOLD}eevolvv Agent Eval Harness${RESET}`)
  console.log(`${DIM}Target: ${targetUrl}${RESET}`)
  console.log(`${DIM}Running ${fixtures.length} test case${fixtures.length === 1 ? '' : 's'}…${RESET}\n`)

  const results: TestResult[] = []

  for (const fixture of fixtures) {
    process.stdout.write(`  ${DIM}${fixture.id}${RESET} ${fixture.name} … `)
    const result = await runTest(fixture)
    results.push(result)

    if (result.passed) {
      console.log(`${GREEN}PASS${RESET} ${DIM}(${result.latencyMs}ms, ${result.outputLength} chars)${RESET}`)
    } else {
      console.log(`${RED}FAIL${RESET}`)
      for (const f of result.failures) {
        console.log(`       ${YELLOW}↳ ${f}${RESET}`)
      }
    }
  }

  const passed = results.filter(r => r.passed).length
  const failed = results.length - passed

  console.log(`\n${BOLD}Results: ${passed === results.length ? GREEN : RED}${passed}/${results.length} passed${RESET}`)
  if (failed > 0) {
    console.log(`${RED}${failed} test${failed === 1 ? '' : 's'} failed${RESET}\n`)
    process.exit(1)
  }
  console.log()
}

main()
