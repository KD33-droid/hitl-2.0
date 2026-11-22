import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir:'tests/e2e', workers:1, timeout:45_000,
  use:{baseURL:'http://127.0.0.1:4287',viewport:{width:1440,height:960},
    channel:process.env.PW_CHANNEL || undefined,
    launchOptions:{args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']},
    screenshot:'only-on-failure'},
  webServer:{command:'npm run preview -- --port 4287 --strictPort',url:'http://127.0.0.1:4287',reuseExistingServer:false}
})
