export type NodeId = 'agent' | 'risk' | 'policy' | 'human' | 'audit'
export type Source = { path: string; section: string; note: string }
export interface ComponentRecord {
  id: NodeId; number: string; name: string; short: string; role: string
  color: string; description: string; inputs: string[]; outputs: string[]
  dependencies: string; implementation: string; illustration: string; sources: Source[]
}
export const sourceRoot = 'docs/research/workstreams/ws1-threat-model/'
const schema = (section: string, note: string): Source => ({ path: 'src/hitl2/schemas.py', section, note })
const status = (section: string, note: string): Source => ({ path: 'docs/research/research-status.md', section, note })
export const components: ComponentRecord[] = [
  {
    id: 'agent', number: '01', name: 'Agentic AI Decision Engine', short: 'Decision engine', role: 'Orchestration',
    color: '#6ee1ff', description: 'An agent proposes an action. The control plane considers assessment and policy evidence before emitting a governance decision.',
    inputs: ['Agent context', 'Action parameters'], outputs: ['Action proposal', 'Governance decision'],
    dependencies: 'Risk assessment and policy evaluation inform the control-plane decision. The agent does not authorise its own action.',
    implementation: 'The agents and governance namespaces reserve separate boundaries. ActionProposal and GovernanceDecision are typed placeholders.',
    illustration: 'One core groups two roles: the outbound proposal belongs to the agent; policy evidence returns to the control plane for a decision.',
    sources: [schema('ActionProposal · GovernanceDecision', 'Correlation and provisional inputs/outputs; the decision vocabulary is unresolved.'),
      {path:'README.md', section:'High-level architecture', note:'The proposed control plane receives an action proposal before making a decision.'}]
  },
  {
    id: 'risk', number: '02', name: 'Risk Scoring Model', short: 'Risk assessment', role: 'Assessment',
    color: '#90b9ff', description: 'The proposed assessment stage receives a proposal and its context, then returns evidence for policy evaluation.',
    inputs: ['Action proposal', 'Scenario context'], outputs: ['Risk assessment'],
    dependencies: 'Depends on proposal correlation. Features, thresholds and model selection are open research decisions.',
    implementation: 'RiskAssessment is a placeholder with an open result dictionary. No classifier or risk model is implemented.',
    illustration: 'The layered sensor represents assessment. Scenario explanations are authored text and carry no numerical score.',
    sources: [schema('RiskAssessment', 'The result contract, features and levels have not been agreed.'), status('Agreement gates · RSM specification', 'The model, features and thresholds are open.')]
  },
  {
    id: 'policy', number: '03', name: 'Policy Governance Engine', short: 'Policy governance', role: 'Policy evaluation',
    color: '#63d3ed', description: 'The proposed policy boundary checks a requested action against governance constraints and returns evaluation evidence.',
    inputs: ['Action proposal', 'Risk assessment'], outputs: ['Policy evaluation'],
    dependencies: 'Depends on the proposed policy repository and assessment interface. Constraint composition is unresolved.',
    implementation: 'The policies namespace defines intent only. No OPA integration, Rego bundle or runtime enforcement is present.',
    illustration: 'Parallel blades represent distinct checks. The demo fixtures name each check and its illustrative result.',
    sources: [{path:'src/hitl2/policies/__init__.py', section:'Policy boundary', note:'A namespace placeholder for policy repository and validation.'}, status('Policy engine integration', 'No OPA or other engine is integrated.')]
  },
  {
    id: 'human', number: '04', name: 'Human Approval Layer', short: 'Human oversight', role: 'Human intervention',
    color: '#efb768', description: 'A person can monitor, confirm a bounded action, approve a request for elevated authority, or take control.',
    inputs: ['Review request', 'Decision context'], outputs: ['Human response'],
    dependencies: 'Review needs a specified scope and authority. WM1 distinguishes L2 confirmation from L3 privileged approval.',
    implementation: 'The human_oversight namespace is a placeholder. Routing, authority and expiry are unresolved.',
    illustration: 'The amber branch shows an optional request and response. No timeout is treated as approval.',
    sources: [{path:sourceRoot+'system-characterization.md',section:'§3 · Autonomy convention',note:'L0 full autonomy; L1 monitoring; L2 bounded confirmation; L3 elevated approval; L4 control/override.'}, {path:'src/hitl2/human_oversight/__init__.py', section:'Human oversight boundary', note:'No workflow or autonomy-level selection is implemented.'}]
  },
  {
    id: 'audit', number: '05', name: 'Audit Layer', short: 'Audit record', role: 'Traceability',
    color: '#a1c4f7', description: 'The proposed audit layer records a decision and its context so a reviewer can reconstruct the governance path.',
    inputs: ['Decision context', 'Review response, if any'], outputs: ['Audit event'],
    dependencies: 'Depends on correlated decisions and review details. Trust anchors, clock trust and verification procedures are unresolved.',
    implementation: 'AuditEvent is a typed placeholder. It contains no integrity fields, chaining or storage mechanism.',
    illustration: 'The stacked archive represents the intended record boundary, with no storage or integrity guarantee.',
    sources: [schema('AuditEvent', 'ID, event type, timestamp and payload are placeholders.'),{path:sourceRoot+'asset-inventory.md',section:'§2 · A-08 security properties',note:'Completeness, tamper evidence and immutability are not established.'}]
  },
]
export const byId = Object.fromEntries(components.map(c => [c.id, c])) as Record<NodeId, ComponentRecord>
export const flow: ReadonlyArray<{from:NodeId;to:NodeId;label:string}> = [
  {from:'agent',to:'risk',label:'Submit action proposal'},
  {from:'risk',to:'policy',label:'Pass assessment evidence'},
  {from:'policy',to:'agent',label:'Return policy evaluation'},
  {from:'agent',to:'human',label:'Request review, if required'},
  {from:'human',to:'agent',label:'Return human response'},
  {from:'agent',to:'audit',label:'Record decision context'}
]
