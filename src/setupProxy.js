const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://testapi.v2.ladder.top:443',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`)
      }
    })
  )
}
