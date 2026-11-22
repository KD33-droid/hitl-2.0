import type { RunEvent } from './contracts'
import { project } from './projection'
import { scenarios } from './scenarios'
import type { Session } from './session'

type Stage<S extends RunEvent['stage']> = Extract<RunEvent, {stage:S}>

/** One counted unit. Event IDs and request IDs are only unique within a run. */
export type Evidence<E extends RunEvent = RunEvent> = {
  key:string
  event:E
  category:string
  related?:RunEvent
  // An evaluation can contribute several results from the very same event.
  checkIndex?:number
}

function group<T extends Evidence>(items:T[], domain:readonly string[] = []) {
  const groups = new Map<string, T[]>(domain.map(label => [label, []]))
  for (const item of items) {
    const bucket = groups.get(item.category)
    if (bucket) bucket.push(item)
    else groups.set(item.category, [item])
  }
  return {items, groups}
}

/** Event references, not separately maintained counters, are the measure of every bucket. */
export function projectMetrics(session:Session) {
  const runs = new Map(session.runs.map(run => [run.key, {run, ...project(run)}]))
  const agents:Evidence<Stage<'proposed'>>[] = []
  const decisions:Evidence<Stage<'finalised'>>[] = []
  const pending:Evidence<Stage<'waiting-for-human'>>[] = []
  const responses:Evidence<Stage<'responded'>>[] = []
  const risk:Evidence<Stage<'assessed'>>[] = []
  const policies:Evidence<Stage<'evaluated'>>[] = []

  // A run's logical clock starts again at the fixture epoch. Only the session
  // interleaving can order, for example, the completion of two identical runs.
  for (const {key, sequence} of session.order) {
    const row = runs.get(key)
    const event = row?.run.events[sequence - 1]
    if (!row || event?.sequence !== sequence) throw new Error('Unknown session event reference.')
    switch (event.stage) {
      case 'proposed':
        agents.push({key, event, category:event.agentId})
        break
      case 'assessed':
        risk.push({key, event, category:row.proposal.requested.condition, related:row.proposal})
        break
      case 'evaluated':
        event.checks.forEach((check, checkIndex) => {
          policies.push({key, event, category:check.result, checkIndex})
        })
        break
      case 'waiting-for-human':
        if (event === row.pending) pending.push({key, event, category:event.mode})
        break
      case 'responded':
        responses.push({key, event, category:event.response.choice, related:row.run.events[sequence - 2]})
        break
      case 'finalised':
        decisions.push({key, event, category:event.disposition.kind})
        break
    }
  }

  return {
    agents:group(agents, scenarios.map(s => s.agentId)),
    decisions:group(decisions, ['allow', 'restrict', 'deny']),
    pending:group(pending),
    responses:group(responses, ['confirm', 'approve', 'reject', 'refer']),
    risk:group(risk, scenarios.map(s => s.input.condition)),
    policies:group(policies, ['pass', 'fail', 'not-applicable']),
    recent:[...decisions].reverse(),
  }
}
