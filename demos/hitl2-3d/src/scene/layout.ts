import type { NodeId } from '../catalogue'
export type Point = [number, number, number]
export const layout:Record<NodeId, Point> = {
  agent:[0,0,-.1],risk:[-4.45,0,-2.5],policy:[4.45,0,-2.5],human:[-3.7,0,2.95],audit:[3.7,0,2.95]
}
export type CameraCommand = {kind:'overview'|'inspect'|'in'|'out';target:NodeId;serial:number}
