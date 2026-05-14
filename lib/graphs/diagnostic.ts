/**
 * LangGraph diagnostic graph for business analysis.
 * 4-node pipeline: snapshot → opportunities → roi → compile
 */

import { StateGraph, Annotation } from '@langchain/langgraph'
import { ChatAnthropic } from '@langchain/anthropic'

// Lazily created — avoids errors when ANTHROPIC_API_KEY is absent at import time
let _model: ChatAnthropic | null = null
function getModel(): ChatAnthropic {
  if (!_model) {
    _model = new ChatAnthropic({
      model: 'claude-sonnet-4-6',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      maxTokens: 2000,
    })
  }
  return _model
}

// State schema
const DiagnosticState = Annotation.Root({
  businessInfo: Annotation<string>(),
  industry: Annotation<string>(),
  snapshot: Annotation<string>(),
  opportunities: Annotation<string>(),
  roiProjection: Annotation<string>(),
  report: Annotation<string>(),
})

type DiagnosticStateType = typeof DiagnosticState.State

export function buildDiagnosticGraph() {
  const graph = new StateGraph(DiagnosticState)
    .addNode('snapshot', async (state: DiagnosticStateType) => {
      const model = getModel()
      const response = await model.invoke(
        `Analyze this business and generate a concise 2-3 paragraph snapshot covering current state, strengths, and key challenges:\n\n${state.businessInfo}`
      )
      return { snapshot: typeof response.content === 'string' ? response.content : JSON.stringify(response.content) }
    })
    .addNode('opportunities', async (state: DiagnosticStateType) => {
      const model = getModel()
      const response = await model.invoke(
        `Based on this business snapshot:\n${state.snapshot}\n\nIdentify the top 3 automation opportunities for a ${state.industry || 'small business'}. For each: name, current pain, proposed automation, estimated hours saved/week.`
      )
      return { opportunities: typeof response.content === 'string' ? response.content : JSON.stringify(response.content) }
    })
    .addNode('roi', async (state: DiagnosticStateType) => {
      const model = getModel()
      const response = await model.invoke(
        `Based on these automation opportunities:\n${state.opportunities}\n\nProject realistic ROI. Include:\n- HOURS_FREED per month\n- AUTOMATIONS count\n- ANNUAL_SAVINGS estimate in USD\n- Payback period\n\nBe specific and conservative.`
      )
      return { roiProjection: typeof response.content === 'string' ? response.content : JSON.stringify(response.content) }
    })
    .addNode('compile', async (state: DiagnosticStateType) => {
      const sections = [
        '# Business Diagnostic Report',
        '',
        '## Business Snapshot',
        state.snapshot,
        '',
        '## Top Automation Opportunities',
        state.opportunities,
        '',
        '## ROI Projection',
        state.roiProjection,
      ]
      return { report: sections.join('\n') }
    })
    .addEdge('__start__', 'snapshot')
    .addEdge('snapshot', 'opportunities')
    .addEdge('opportunities', 'roi')
    .addEdge('roi', 'compile')
    .addEdge('compile', '__end__')

  return graph.compile()
}
