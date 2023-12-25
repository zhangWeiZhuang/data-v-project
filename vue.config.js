const { defineConfig } = require('@vue/cli-service')
const name = `智慧幼教-数据大屏`
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    name: name,
  }
})
