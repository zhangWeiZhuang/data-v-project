const { defineConfig } = require('@vue/cli-service')
const name = `智慧幼教-数据大屏`
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    name: name,
  }
  // , devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://www.bestyoung.cn:20798", // 后台接口域名
  //       changeOrigin: true, //是否跨域
  //       pathRewrite: {
  //         "^/api": ""
  //       },
  //     },
  //     "/simpleWeather": {
  //       target: "http://apis.juhe.cn", // 后台接口域名
  //       changeOrigin: true, //是否跨域
  //       pathRewrite: {
  //         "^/api": ""
  //       },
  //     },
  //   },
  // },
})
