/** Demo-only contracts. These are neither research schemas nor an executable policy. */
export type ScenarioInput = Readonly<{action:'preview'|'export'|'release'; condition:string}>
export type ReviewMode = 'bounded-confirmation' | 'elevated-approval'
export type Response = Readonly<{requestId:string; reviewerAlias:string; rationale:string;
  choice:'confirm'|'approve'|'reject'|'refer'}>
export type Route = {kind:'allow'|'deny'} | {kind:'restrict'; alternative:string} |
  {kind:'request-review'; mode:ReviewMode}
export interface ScenarioCase {
  id:string; version:'1.0.0'; origin:'synthetic-fixture'; agentId:string
  input:ScenarioInput; explanation:string
  checks:ReadonlyArray<{id:string; result:'pass'|'fail'|'not-applicable'; reason:string}>
  route:Route
}
/** Replay identity excludes wall time, playback rate and camera positions. */
export type ReplayInput = Readonly<{fixtureId:string;version:string;responses:readonly Response[]}>
export type FinalDisposition = Exclude<Route,{kind:'request-review'}>
export type EventBody =
  | {stage:'proposed'; agentId:string; requested:ScenarioInput}
  | {stage:'assessed'; assessmentId:string; explanation:string}
  | {stage:'evaluated'; checks:ScenarioCase['checks']}
  | {stage:'routed'; route:Route}
  | {stage:'waiting-for-human'; requestId:string; mode:ReviewMode; reviewerAlias:string; referralTarget:string|null}
  | {stage:'responded'; response:Response}
  | {stage:'finalised'; disposition:FinalDisposition; rationale:string}
  | {stage:'recorded'; finalDecisionSequence:number}
export type RunEvent = Readonly<{proposalId:string;decisionId:string;eventId:string;sequence:number;
  logicalUtc:string;fixtureId:string;fixtureVersion:string;origin:'synthetic-fixture'} & EventBody>
export type Run = Readonly<{key:string;events:readonly RunEvent[]}>
