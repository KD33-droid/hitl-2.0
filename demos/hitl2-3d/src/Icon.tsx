import type { CSSProperties, ReactNode } from 'react'
const paths:Record<string,ReactNode> = {
  agent:<><path d="m12 2 9 8-9 12-9-12zM3 10l9 4 9-4M12 2v12"/></>,
  risk:<><path d="m2 8 10-5 10 5-10 5zM2 12l10 5 10-5M2 16l10 5 10-5"/></>,
  policy:<><path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5z"/><path d="m8 11 3 3 5-6"/></>,
  human:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2M2 14v-2m20 2v-2"/></>,
  audit:<><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 10c0 4 16 4 16 0M4 15c0 4 16 4 16 0"/></>,
  cube:<><path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10"/></>,
  map:<><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="15" y="15" width="7" height="7" rx="1"/><path d="M6 9v9h9m3-3V6H9"/></>,
  book:<><path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1v15"/></>,
  file:<><path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8m-8 4h6"/></>,
  panels:<><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M14 3v18"/></>,
  focus:<><path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6"/><circle cx="12" cy="12" r="3"/></>,
  home:<><path d="m3 10 9-7 9 7M5 9v11h14V9"/></>,
  mouse:<><rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/></>,
  plus:<path d="M12 5v14M5 12h14"/>,minus:<path d="M5 12h14"/>,
  play:<path d="m7 4 13 8-13 8z" fill="currentColor" stroke="none"/>,pause:<path d="M7 4h4v16H7zm7 0h4v16h-4z" fill="currentColor" stroke="none"/>,
  arrow:<path d="m9 5 7 7-7 7"/>, next:<path d="M4 12h16m-7-7 7 7-7 7"/>,
  external:<path d="M6 18 18 6M7 6h11v11"/>,close:<path d="m5 5 14 14m0-14L5 19"/>,
  input:<><path d="M4 6v6h14m-5-5 5 5-5 5"/></>,output:<><path d="M4 18v-6h14m-5-5 5 5-5 5"/></>,
  compass:<><circle cx="12" cy="12" r="9"/><path d="m15 8-2 6-5 2 2-6z"/></>,
  layers:<><path d="m3 8 9-5 9 5-9 5zm0 5 9 5 9-5m-18 5 9 5 9-5"/></>,
  info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>,
  network:<><path d="M6 5h12m-12 0 6 13 6-13"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></>
}
export function Icon({name,size=18,style}:{name:string;size?:number;style?:CSSProperties}){
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" style={style}>{paths[name]}</svg>
}
