module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  assetsDir: 'static',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
}
