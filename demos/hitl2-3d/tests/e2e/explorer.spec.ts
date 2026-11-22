import { test,expect,type Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const shot=async(page:Page,name:string)=>{
  await mkdir('test-results/explorer-captures',{recursive:true})
  await page.screenshot({path:`test-results/explorer-captures/${name}.png`,fullPage:true,animations:'disabled'})
}
const xPos=async(page:Page,name:string)=>(await page.getByRole('button',{name:'Select '+name,exact:true}).boundingBox())!.x
test('renders the five stations; orbit, geometry selection, zoom, focus and overview work',async({page})=>{
  const errors:string[]=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  const risk=page.getByRole('button',{name:'Select Risk Scoring Model',exact:true})
  await expect(risk).toBeVisible()
  await expect(page.locator('.scene-label:visible')).toHaveCount(5)
  await expect(page.locator('canvas')).toBeVisible()
  const human=page.getByRole('button',{name:'Select Human Approval Layer',exact:true})
  await expect(human).toBeVisible()
  await shot(page,'01-spatial-overview')
  // The angled camera projects the front base of the bust just above its label.
  const box=(await human.boundingBox())!
  await page.mouse.click(box.x+box.width/2,box.y-28)
  await expect(page.getByRole('heading',{name:'Human Approval Layer'})).toBeVisible()
  const before=await xPos(page,'Risk Scoring Model')
  const area=(await page.locator('canvas').boundingBox())!
  await page.mouse.move(area.x+area.width*.5,area.y+area.height*.17)
  await page.mouse.down();await page.mouse.move(area.x+area.width*.59,area.y+area.height*.20,{steps:9});await page.mouse.up()
  await expect.poll(async()=>Math.abs(await xPos(page,'Risk Scoring Model')-before)).toBeGreaterThan(4)
  await page.getByRole('button',{name:'Reset overview camera'}).click()
  await expect.poll(async()=>Math.abs(await xPos(page,'Risk Scoring Model')-before)).toBeLessThan(2)
  await page.getByRole('button',{name:'Zoom in',exact:true}).click()
  await expect.poll(async()=>Math.abs(await xPos(page,'Risk Scoring Model')-before)).toBeGreaterThan(10)
  await page.getByRole('button',{name:'Focus component'}).click()
  await page.getByRole('button',{name:/^Sources/}).click()
  await expect(page.getByText('§3 · Autonomy convention')).toBeVisible()
  await shot(page,'02-oversight-inspection')
  await page.getByRole('button',{name:'Reset overview camera'}).click()
  await expect.poll(async()=>Math.abs(await xPos(page,'Risk Scoring Model')-before)).toBeLessThan(2)
  expect(errors).toEqual([])
})
test('all node inspectors, keyboard selection and modal reference navigation',async({page})=>{
  await page.goto('/')
  await page.getByRole('button',{name:'2D map',exact:true}).click()
  for(const name of ['Risk Scoring Model','Policy Governance Engine','Human Approval Layer','Audit Layer','Agentic AI Decision Engine']){
    const b=page.getByRole('button',{name:'Inspect '+name,exact:true});await b.focus();await page.keyboard.press('Enter')
    await expect(page.getByRole('heading',{name,exact:true})).toBeVisible()
  }
  await page.getByRole('button',{name:'Research notes'}).click()
  await expect(page.getByRole('dialog')).toContainText('Human control / override')
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button',{name:'Fixture index'}).click()
  await expect(page.getByRole('dialog')).toContainText('release-elevated')
  await page.getByRole('button',{name:'Close reference'}).click()
  await page.getByRole('button',{name:'Select Audit Layer',exact:true}).click()
  await page.getByText('Dependencies & boundaries').click()
  await expect(page.getByText('AuditEvent is a typed placeholder.',{exact:false})).toBeVisible()
})
test('automatic fallback remains usable without WebGL, with trace controls and no external assets',async({page})=>{
  const foreign:string[]=[]
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:4287/'))foreign.push(r.url())})
  await page.addInitScript(()=>{
    const get=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type.includes('webgl'))return null
      return Reflect.apply(get,this,[type,...args])
    } as typeof get
  })
  await page.goto('/')
  await expect(page.getByText('WebGL unavailable · Interactive 2D map')).toBeVisible()
  await page.getByRole('button',{name:'Select Policy Governance Engine',exact:true}).click()
  await expect(page.getByRole('heading',{name:'Policy Governance Engine'})).toBeVisible()
  await page.getByRole('button',{name:'Trace flow'}).click()
  await expect(page.getByText('Pass assessment evidence',{exact:false})).toBeVisible()
  await page.getByRole('button',{name:'Pause trace'}).click()
  await expect(page.getByRole('button',{name:'Resume trace'})).toBeVisible()
  await shot(page,'03-fallback-map')
  await page.getByRole('button',{name:'Reset flow trace'}).click()
  await expect(page.getByRole('button',{name:'Trace flow'})).toBeVisible()
  expect(foreign).toEqual([])
})
test('phone layout fits without horizontal scrolling and preserves selection between projections',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await page.getByRole('button',{name:'Select Risk Scoring Model',exact:true}).click()
  await expect(page.getByRole('heading',{name:'Risk Scoring Model'})).toBeVisible()
  await shot(page,'04-mobile-explorer')
  await page.getByRole('button',{name:'2D map',exact:true}).click()
  await expect(page.getByRole('button',{name:'Select Risk Scoring Model',exact:true})).toHaveAttribute('aria-pressed','true')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
