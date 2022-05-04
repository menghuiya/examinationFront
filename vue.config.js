module.exports = {
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require("postcss-px2rem")({
            remUnit: 108,
          }),
        ],
      },
    },
  },
  devServer: {
    proxy: {
      "/admin": {
        target: "http://127.0.0.1:3000/", // 域名
        ws: true, // 是否启用websockets
        changeOrigin: true, //开启代理
      },
      "/api": {
        target: "http://127.0.0.1:3000/", // 域名
        ws: true, // 是否启用websockets
        changeOrigin: true, //开启代理
      },
      "/public": {
        target: "http://127.0.0.1:3000/", // 域名
        ws: true, // 是否启用websockets
        changeOrigin: true, //开启代理
      },
    },
  },
};
